import {
  CircularProgress,
  Divider,
  Modal,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { ReactComponent as ArrowLeftIcon } from "assets/svgs/arrow_left.svg";
import { ReactComponent as CloseIcon } from "assets/svgs/close.svg";
import clsx from "clsx";
import React, { useCallback, useEffect } from "react";
import { getLogger } from "utils/logger";

const logger = getLogger("BaseModal::Index");

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    outline: "none",
    backgroundColor: theme.colors.default,
    maxWidth: 460,
    width: "100%",
    padding: `${theme.spacing(2)}px`,
    position: "relative",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: theme.colors.reverse,
    padding: `0 ${theme.spacing(2)}px`,
    fontWeight: "bold",
    fontSize: 16,
    lineHeight: "24px",
  },
  mainContent: {
    marginTop: theme.spacing(2),
    textAlign: "center",
    "& > * + *": { marginTop: theme.spacing(2) },
  },
  iconButton: {
    width: 24,
    height: 24,
    color: theme.colors.gray20,
    cursor: "pointer",
    "&.hidden": { opacity: 0, cursor: "auto" },
    "& svg": { width: 24, height: 24 },
  },
}));

interface IProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode | React.ReactNode[];
  title: string;
  onBack: () => void;
  backVisible?: boolean;
}

export const BaseModal = (props: IProps) => {
  const classes = useStyles();
  const { backVisible = true, onBack, title } = props;

  return (
    <Modal
      className={classes.modal}
      disableBackdropClick={false}
      disableEnforceFocus
      onClose={props.onClose}
      open={props.visible}
    >
      <div className={classes.content}>
        <div className={classes.header}>
          <span
            className={clsx(classes.iconButton, backVisible ? "" : "hidden")}
            onClick={() => {
              if (backVisible) onBack();
            }}
          >
            <ArrowLeftIcon />
          </span>
          <Typography align="center" className={classes.title}>
            {title}
          </Typography>
          <span className={classes.iconButton} onClick={props.onClose}>
            <CloseIcon />
          </span>
        </div>
        <div className={classes.mainContent}>{props.children}</div>
      </div>
    </Modal>
  );
};
