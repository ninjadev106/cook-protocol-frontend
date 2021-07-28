import { Button, Typography, makeStyles } from "@material-ui/core";
import { ReactComponent as PlusIcon } from "assets/svgs/plus.svg";
import clsx from "clsx";
import {
  BuySellModal,
  IssueRedeemModal,
  SectionHeader,
  Spinner,
} from "components";
import { DEFAULT_NETWORK_ID } from "config/constants";
import { getContractAddress, getToken } from "config/network";
import { useConnectedWeb3Context, useGlobal } from "contexts";
import { BigNumber } from "ethers";
import { useCkDetails } from "helpers";
import { transparentize } from "polished";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { ERC20Service } from "services/erc20";
import { IssuanceService } from "services/issuance";
import { KnownToken } from "types";
import { ZERO_NUMBER } from "utils/number";
import { isAddress } from "utils/tools";

import {
  AboutSection,
  AddAssetModal,
  AverageCostSection,
  HeaderSection,
  InvestmentHistorySection,
  MainSection,
  TokenDistributionSection,
  TotalAssetValueSection,
  WhitelistSection,
} from "./components";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
    },
  },
  left: {
    padding: 24,
    flex: 1,
    [theme.breakpoints.down("md")]: { width: "100%", flex: "unset" },
  },
  right: {
    padding: 24,

    width: "35%",
    maxWidth: 440,
    backgroundColor: transparentize(0.1, theme.colors.default),
    [theme.breakpoints.down("md")]: { width: "100%" },
  },
  section: {
    marginBottom: 24,
  },
  swapWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    "& > div": {
      "&:first-child": {
        marginBottom: 0,
      },
    },
    marginBottom: 8,
  },
  swapButton: {
    height: 40,
    fontSize: 16,
    lineHeight: "28px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    color: theme.colors.reverse,
    "& span": {
      textTransform: "none",
    },
    "&:hover": {
      color: theme.colors.secondary,
    },
  },
}));

interface IState {
  assetModalVisible: boolean;
  sellModalVisible: boolean;
  buyModalVisible: boolean;
  issueModalVisible: boolean;
  redeemModalVisible: boolean;
}

const FundDetailsPage = () => {
  const classes = useStyles();
  const [state, setState] = useState<IState>({
    assetModalVisible: false,
    sellModalVisible: false,
    buyModalVisible: false,
    issueModalVisible: false,
    redeemModalVisible: false,
  });
  const { account, library: provider, networkId } = useConnectedWeb3Context();
  const params = useParams();
  const history = useHistory();
  const ckAddress = ((params as any) || {}).id;
  const { setTransactionModalVisible } = useGlobal();

  const { details: ckInfo, loading: ckLoading } = useCkDetails(
    ckAddress,
    provider,
    networkId
  );

  const setAssetModalVisible = (assetModalVisible: boolean) =>
    setState((prev) => ({ ...prev, assetModalVisible }));

  const onNewAsset = () => {
    setAssetModalVisible(true);
  };

  const onBuy = () => {
    setState((prev) => ({ ...prev, buyModalVisible: true }));
    // approveToken();
  };

  const onSell = () => {
    setState((prev) => ({ ...prev, sellModalVisible: true }));
  };

  const onCloseModal = () => {
    setState((prev) => ({
      ...prev,
      sellModalVisible: false,
      buyModalVisible: false,
      redeemModalVisible: false,
      issueModalVisible: false,
    }));
  };

  const setRedeemModalVisible = (redeemModalVisible: boolean) => {
    setState((prev) => ({
      ...prev,
      redeemModalVisible,
    }));
  };

  const setIssueModalVisible = (issueModalVisible: boolean) => {
    setState((prev) => ({
      ...prev,
      issueModalVisible,
    }));
  };

  const onConfirmIssueRedeem = async (amount: BigNumber) => {
    if (!provider || !ckInfo) return;
    const issuanceAddress = getContractAddress(
      networkId || DEFAULT_NETWORK_ID,
      "basicIssuance"
    );
    const issuanceService = new IssuanceService(
      provider,
      account,
      issuanceAddress
    );
    const isIssue = state.issueModalVisible;

    try {
      setTransactionModalVisible(true, "", "Waiting for confirmation");
      let txHash;
      if (isIssue) {
        // check allowance
        let totalAmount: BigNumber = ZERO_NUMBER;
        Object.values(ckInfo.tokens).forEach((element) => {
          totalAmount = totalAmount.add(element);
        });
        const tokenIds = Object.keys(ckInfo.tokens);

        for (let index = 0; index < tokenIds.length; index++) {
          const tokenId = tokenIds[index];
          const tokenAddress = getToken(tokenId as KnownToken, networkId)
            .address;
          const erc20Service = new ERC20Service(
            provider,
            account,
            tokenAddress
          );
          const allowanceNeeds = totalAmount.isZero()
            ? amount
            : amount.mul(ckInfo.tokens[tokenId as KnownToken]).div(totalAmount);
          const isEnough = await erc20Service.hasEnoughAllowance(
            account || "",
            issuanceAddress,
            allowanceNeeds
          );
          if (!isEnough) {
            setTransactionModalVisible(
              true,
              "",
              `Approving for ${tokenId.toUpperCase()}`
            );
            txHash = await erc20Service.approveUnlimited(issuanceAddress);
            setTransactionModalVisible(
              true,
              txHash,
              `Approving for ${tokenId.toUpperCase()}`
            );
            await provider.waitForTransaction(txHash);
          }
        }
        // issue
        txHash = await issuanceService.issue(ckAddress, amount, account || "");
      } else {
        txHash = await issuanceService.redeem(ckAddress, amount, account || "");
      }
      setTransactionModalVisible(
        true,
        txHash,
        isIssue ? "Doing issue..." : "Doing redeem..."
      );
      await provider.waitForTransaction(txHash);
      setTransactionModalVisible(false);
      onCloseModal();
    } catch (error) {
      console.warn(error);
      setTransactionModalVisible(false);
      onCloseModal();
    }
  };

  useEffect(() => {
    if (!ckAddress || !isAddress(ckAddress)) {
      history.push("/");
    }
  }, [ckAddress]);

  const renderContent = () => {
    if (!ckInfo) return null;

    return (
      <>
        <div className={classes.left}>
          <HeaderSection
            name={ckInfo.name}
            onBuy={onBuy}
            onIssue={() => setIssueModalVisible(true)}
            onRedeem={() => setRedeemModalVisible(true)}
            onSell={onSell}
          />
          <MainSection className={classes.section} />
          <div className={classes.swapWrapper}>
            <SectionHeader title="Asset distribution" />
            <Button
              className={classes.swapButton}
              color="secondary"
              onClick={onNewAsset}
              variant="outlined"
            >
              <PlusIcon />
              &nbsp;&nbsp;
              <Typography>Add new asset</Typography>
            </Button>
          </div>

          <TokenDistributionSection className={classes.section} pool={ckInfo} />
          <SectionHeader title="Investment History" />
          <InvestmentHistorySection className={classes.section} />
        </div>
        <div className={classes.right}>
          <SectionHeader title="Total Asset Value" />
          <TotalAssetValueSection />
          <SectionHeader title="Average cost" />
          <AverageCostSection />
          <SectionHeader title="About" />
          <AboutSection className={classes.section} />
          <SectionHeader title="Whitelist" />
          <WhitelistSection className={classes.section} data={ckInfo} />
        </div>
        {(state.issueModalVisible || state.redeemModalVisible) && (
          <IssueRedeemModal
            ckInfo={ckInfo}
            isIssue={state.issueModalVisible}
            onClose={onCloseModal}
            onConfirm={onConfirmIssueRedeem}
            visible
          />
        )}
        {(state.buyModalVisible || state.sellModalVisible) && (
          <BuySellModal
            ckAddress={ckAddress}
            ckSymbol={ckInfo.symbol}
            isSell={state.sellModalVisible}
            onClose={onCloseModal}
            visible
            whitelistTokenIds={["dai"]}
          />
        )}
      </>
    );
  };

  return (
    <div className={clsx(classes.root)}>
      {ckLoading ? <Spinner /> : renderContent()}
      {state.assetModalVisible && (
        <AddAssetModal
          onClose={() => setAssetModalVisible(false)}
          visible={state.assetModalVisible}
        />
      )}
    </div>
  );
};

export default FundDetailsPage;
