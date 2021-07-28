import { Typography, makeStyles } from "@material-ui/core";
import { ReactComponent as AddTokenIcon } from "assets/svgs/add_token.svg";
import { ReactComponent as AddYieldIcon } from "assets/svgs/add_yield.svg";
import clsx from "clsx";
import { BaseModal, TokenSelectList } from "components";
import { transparentize } from "polished";
import React, { useState } from "react";
import useCommonStyles from "styles/common";
import { KnownToken } from "types";

const useStyles = makeStyles((theme) => ({
  selectItem: {
    height: 200,
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.3s",
    border: `1px solid ${transparentize(0.9, theme.colors.secondary)}`,
    "&:hover": {
      opacity: 0.7,
    },
    "& + &": {
      marginTop: 24,
    },
  },
  selectItemTitle: {
    fontSize: 20,
    color: theme.colors.reverse,
    marginTop: 16,
  },
  selectItemDescription: {
    fontSize: 16,
    color: theme.colors.default400,
    marginTop: 16,
  },
  tokenList: {
    maxHeight: "50vh",
    overflowY: "auto",
    padding: "0 4px",
  },
}));

enum EStep {
  Select = "Select",
  Token = "Token",
  Yield = "Yield",
}

interface IProps {
  visible: boolean;
  onClose: () => void;
}

interface IState {
  step: EStep;
  tokenId?: KnownToken;
}

export const AddAssetModal = (props: IProps) => {
  const { onClose, visible } = props;
  const [state, setState] = useState<IState>({
    step: EStep.Select,
  });
  const classes = useStyles();
  const commonClasses = useCommonStyles();

  const selectStep = (step: EStep) => setState((prev) => ({ ...prev, step }));

  const onBack = () => {
    selectStep(EStep.Select);
  };

  const renderSelect = () => {
    return (
      <div>
        <div
          className={classes.selectItem}
          onClick={() => selectStep(EStep.Token)}
        >
          <AddTokenIcon />
          <Typography className={classes.selectItemTitle}>Add Token</Typography>
          <Typography className={classes.selectItemDescription}>
            Yield farming is the practice of staking or lending crypto assets in
            order to generate high returns or rewards in the form of additional
            cryptocurrency.
          </Typography>
        </div>
        <div
          className={classes.selectItem}
          onClick={() => selectStep(EStep.Yield)}
        >
          <AddYieldIcon />
          <Typography className={classes.selectItemTitle}>Add Yield</Typography>
          <Typography className={classes.selectItemDescription}>
            Yield farming is the practice of staking or lending crypto assets in
            order to generate high returns or rewards in the form of additional
            cryptocurrency.
          </Typography>
        </div>
      </div>
    );
  };

  const renderTokenSelect = () => {
    return (
      <div className={clsx(classes.tokenList, commonClasses.scroll)}>
        <TokenSelectList
          disabledTokens={[]}
          onSelect={(token) => {}}
          searchable={false}
        />
      </div>
    );
  };

  const renderYieldSelect = () => {};

  return (
    <BaseModal
      backVisible={state.step !== EStep.Select}
      onBack={onBack}
      onClose={onClose}
      title={
        state.step === EStep.Select
          ? "Add new asset"
          : state.step === EStep.Token
          ? "Choose Token"
          : "Choose Yield"
      }
      visible={visible}
    >
      <div>
        {state.step === EStep.Select && renderSelect()}
        {state.step === EStep.Token && renderTokenSelect()}
        {state.step === EStep.Yield && renderYieldSelect()}
      </div>
    </BaseModal>
  );
};
