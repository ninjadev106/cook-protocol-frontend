import { Divider, Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { FundChart } from "components/Chart";
import { Spinner } from "components/Loader";
import { DEFAULT_NETWORK_ID } from "config/constants";
import { getToken } from "config/network";
import { useConnectedWeb3Context, useGlobal } from "contexts";
import { providers } from "ethers";
import { useCkDetails } from "helpers";
import { transparentize } from "polished";
import React from "react";
import { NavLink } from "react-router-dom";
import { IPoolDetails, KnownToken } from "types";
import { getPoolDetailsFromPool } from "utils/pool";

const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.colors.gradient2,
    borderRadius: 8,
    padding: "3px 23px",
  },
  header: {
    padding: "30px 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    color: theme.colors.reverse,
    lineHeight: "24px",
  },
  details: {
    textDecoration: "none",
    color: transparentize(0.3, theme.colors.success),
    fontSize: 14,
    lineHeight: "21px",
  },
  content: {
    padding: "40px 0",
  },
  itemRow: {
    "& + &": {
      marginTop: 8,
    },
    fontSize: 14,
    lineHeight: "20px",
    display: "flex",
    alignItems: "center",
    "& div": {
      flex: 1,
      color: theme.colors.default400,
    },
    "& span": {
      fontSize: 14,
      lineHeight: "20px",
      flex: 1,
      color: theme.colors.reverse,
      "&.positive": {
        color: theme.colors.success,
      },
      "&.negative": {
        color: theme.colors.warn,
      },
    },
  },
  assets: {
    display: "flex",
    alignItems: "center",
    "& span": {
      flex: "unset",
    },
  },
  icon: {
    width: 16,
    height: 16,
    color: "unset !important",
    display: "inline-block !important",
    padding: "0 !important",
    "& svg": {
      width: 16,
      height: 16,
    },
    marginRight: 3,
  },
}));

interface IProps {
  ck: string;
  className?: string;
}

export const FeaturedLiquidityPoolCard = (props: IProps) => {
  const classes = useStyles();
  const { library: provider, networkId } = useConnectedWeb3Context();
  const { ck } = props;
  const { tokenPrices } = useGlobal();
  const { details: ckInfo, loading: ckLoading } = useCkDetails(
    ck,
    provider,
    networkId
  );

  const renderContent = () => {
    if (!ckInfo) return null;
    const { id, name, tokens } = ckInfo;
    const ckDetails = getPoolDetailsFromPool(ckInfo, tokenPrices);
    const { assetType, returns24h } = ckDetails;
    const moreAssets = Object.keys(tokens).length - 4;
    return (
      <>
        <div className={classes.header}>
          <Typography className={classes.title}>{name}</Typography>
          <NavLink className={classes.details} to={`/fund/${id}`}>
            See Details
          </NavLink>
        </div>

        <FundChart data={ckDetails} />
        <div className={classes.content}>
          <div className={classes.itemRow}>
            <div>Returns(24h):</div>
            <span
              className={
                returns24h > 0 ? "positive" : returns24h < 0 ? "negative" : ""
              }
            >
              {returns24h > 0 ? "+" : ""}
              {returns24h}%
            </span>
          </div>
          <div className={classes.itemRow}>
            <div>Risk Index:</div>
            <span>{5}</span>
          </div>
          <div className={classes.itemRow}>
            <div>Sector:</div>
            <span>{assetType}</span>
          </div>
          <div className={classes.itemRow}>
            <div>Assets:</div>
            <span className={classes.assets}>
              {Object.keys(tokens)
                .slice(0, 4)
                .map((key) => {
                  const token = getToken(
                    key as KnownToken,
                    networkId || DEFAULT_NETWORK_ID
                  );
                  const { icon: Icon } = token;
                  return (
                    <span className={classes.icon} key={token.name}>
                      <Icon />
                    </span>
                  );
                })}
              {moreAssets > 0 && (
                <span className="more-assets">+{moreAssets}</span>
              )}
            </span>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className={clsx(classes.root, props.className)}>
      {ckLoading ? <Spinner /> : renderContent()}
    </div>
  );
};
