import { FormControl, MenuItem, Select, makeStyles } from "@material-ui/core";
import { SortableFundsTable, Spinner } from "components";
import { TOKEN_DECIMALS } from "config/constants";
import { useConnectedWeb3Context, useGlobal } from "contexts";
import { BigNumber } from "ethers";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import useCommonStyles from "styles/common";
import { IPool, IPoolDetails } from "types";
import { AssetType } from "types/enums";
import { formatBigNumber } from "utils";
import { ZERO_NUMBER } from "utils/number";
import { getCKDetails, getPoolDetailsFromPool } from "utils/pool";
import { calculateValuation } from "utils/token";

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: 24,
  },
  filter: {
    display: "flex",
    alignItems: "center",
  },
  filterControl: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    "& + &": {
      marginLeft: 40,
    },
    "& > * +*": {
      marginLeft: 10,
    },
  },
  filterSelect: {
    color: theme.colors.reverse,
    minWidth: 140,
    backgroundColor: theme.colors.default,
    marginTop: "0px !important",
    padding: "8px 10px",
    border: `1px solid ${theme.colors.default700}`,
    "& svg": {
      color: theme.colors.reverse,
    },
  },
  filterSelectLabel: {
    color: `${theme.colors.default400} !important`,
    display: "inline-block",
    fontWeight: 300,
  },
  content: {
    marginTop: 24,
  },
}));

const typeFilters = [
  { label: "Spot Composite", value: "spot-composite" },
  { label: "Smart Contract", value: "smart-contract" },
  { label: "Stablecoins", value: "stablecoins" },
];
const platformFilters = [
  { label: "Ethereum", value: "eth" },
  { label: "Polkadot", value: "dot" },
  { label: "Binance Smart Chain", value: "bsc" },
  { label: "Huobi Eco Chain", value: "hec" },
];
const tokenFilters = [
  { label: "ETH", value: "eth" },
  { label: "LINK", value: "link" },
  { label: "USDT", value: "usdt" },
  { label: "BNB", value: "bnb" },
];

interface IState {
  filter: {
    type: string;
    platform: string;
    token: string;
  };
  loading: boolean;
  ckInfos: IPool[];
}

interface IProps {
  cks: string[];
  loading: boolean;
}

export const PoolsSection = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const history = useHistory();
  const { library: provider, networkId } = useConnectedWeb3Context();
  const { cks, loading } = props;
  const { tokenPrices } = useGlobal();

  const [state, setState] = useState<IState>({
    filter: { type: "", platform: "", token: "" },
    loading: true,
    ckInfos: [],
  });

  useEffect(() => {
    let isMounted = true;
    const loadPoolsInfo = async () => {
      if (loading) return;
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const pools = await Promise.all(
          cks.map((address) => getCKDetails(address, provider, networkId))
        );
        if (isMounted)
          setState((prev) => ({
            ...prev,
            ckInfos: pools.filter((e) => e !== null) as IPool[],
            loading: false,
          }));
      } catch (error) {
        setState((prev) => ({ ...prev, loading: false, ckInfos: [] }));
      }
    };

    loadPoolsInfo();
    return () => {
      isMounted = false;
    };
  }, [cks, loading]);

  const onChangeFilter = (key: string) => (
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) =>
    setState((prev) => ({
      ...prev,
      filter: { ...prev.filter, [key]: event.target.value },
    }));

  return (
    <div className={classes.root}>
      <div className={classes.filter}>
        <FormControl className={classes.filterControl}>
          <label className={classes.filterSelectLabel} htmlFor="type-label">
            Type
          </label>
          <Select
            className={classes.filterSelect}
            disableUnderline
            labelId="type-label"
            onChange={onChangeFilter("type")}
            value={state.filter.type}
          >
            {typeFilters.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl className={classes.filterControl}>
          <label className={classes.filterSelectLabel} htmlFor="type-label">
            Platform
          </label>
          <Select
            className={classes.filterSelect}
            disableUnderline
            labelId="type-label"
            onChange={onChangeFilter("platform")}
            value={state.filter.platform}
          >
            {platformFilters.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl className={classes.filterControl}>
          <label className={classes.filterSelectLabel} htmlFor="type-label">
            Token
          </label>
          <Select
            className={classes.filterSelect}
            disableUnderline
            labelId="type-label"
            onChange={onChangeFilter("token")}
            value={state.filter.token}
          >
            {tokenFilters.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className={classes.content}>
        <div>
          {state.loading ? (
            <Spinner />
          ) : (
            <SortableFundsTable
              networkId={networkId}
              onClick={(id) => {
                history.push(`/fund/${id}`);
              }}
              rows={state.ckInfos.map((e) =>
                getPoolDetailsFromPool(e, tokenPrices)
              )}
            />
          )}
        </div>
      </div>
    </div>
  );
};
