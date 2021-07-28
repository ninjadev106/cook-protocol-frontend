import { Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { SectionHeader } from "components";
import { DEFAULT_NETWORK_ID } from "config/constants";
import { getToken } from "config/network";
import { useConnectedWeb3Context } from "contexts";
import { transparentize } from "polished";
import React from "react";
import { IPool, KnownToken } from "types";

const useStyles = makeStyles((theme) => ({
  root: {},
  content: {
    marginTop: 12,
    display: "flex",
  },
  sectionContent: { flex: 1 },
  sectionTitle: {
    fontSize: 14,
    lineHeight: "21px",
    color: theme.colors.secondary,
  },
  tokenRow: {
    display: "flex",
    alignItems: "center",
    fontSize: 14,
    lineHeight: "21px",
    color: theme.colors.primary,
    margin: "8px 0",
    "& svg": {
      width: 24,
      height: 24,
      marginRight: 8,
    },
  },
}));

interface IProps {
  className?: string;
  data: IPool;
}

export const WhitelistSection = (props: IProps) => {
  const classes = useStyles();
  const { data } = props;
  const { networkId } = useConnectedWeb3Context();

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.content}>
        <div className={classes.sectionContent}>
          <Typography className={classes.sectionTitle}>Tokens:</Typography>
          {Object.keys(data.tokens).map((token) => {
            const tokenInfo = getToken(
              token as KnownToken,
              networkId || DEFAULT_NETWORK_ID
            );
            const Icon = tokenInfo.icon;
            return (
              <div className={classes.tokenRow} key={token}>
                <Icon />
                <span>{token.toUpperCase()}</span>
              </div>
            );
          })}
        </div>
        <div className={classes.sectionContent}>
          <Typography className={classes.sectionTitle}>Yields:</Typography>
        </div>
      </div>
    </div>
  );
};
