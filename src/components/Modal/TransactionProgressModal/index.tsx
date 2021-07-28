import { Button, Typography, makeStyles } from "@material-ui/core";
import { Spinner } from "components/Loader";
import { getEtherscanUri } from "config/network";
import { useConnectedWeb3Context } from "contexts";
import React from "react";

import { BaseModal } from "../BaseModal";

const useStyles = makeStyles((theme) => ({
  root: {},
  description: {
    margin: "32px auto 12px auto",
    maxWidth: "80%",
    color: theme.colors.default400,
  },
  button: {
    display: "flex",
    textDecoration: "none",
    color: theme.colors.reverse,
    backgroundColor: theme.colors.primary700,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
}));

interface IProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  txId: string;
}

export const TransactionProgressModal = (props: IProps) => {
  const classes = useStyles();
  const { library: provider, networkId } = useConnectedWeb3Context();
  const {
    description = "We need to create a transaction and wait until it's confirmed on the network",
    title = "Pending transaction",
    txId,
  } = props;
  const blockExplorer = getEtherscanUri(networkId);
  if (!provider) return null;
  return (
    <BaseModal
      backVisible={false}
      onBack={() => {}}
      onClose={props.onClose}
      title={title}
      visible={props.visible}
    >
      <div>
        <Spinner />
        <Typography align="center" className={classes.description}>
          {description}
        </Typography>
        {txId && (
          <a
            className={classes.button}
            href={`${blockExplorer}tx/${txId}`}
            rel="noreferrer"
            target="_blank"
          >
            View TX
          </a>
        )}
      </div>
    </BaseModal>
  );
};
