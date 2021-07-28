import { Button, makeStyles } from "@material-ui/core";
import { ReactComponent as OrverviewIcon } from "assets/svgs/navbar/chart.svg";
import { ReactComponent as FundIcon } from "assets/svgs/navbar/folder.svg";
import { ReactComponent as ProfileIcon } from "assets/svgs/navbar/profile.svg";
import { ReactComponent as InvestIcon } from "assets/svgs/navbar/wallet.svg";
import { ReactComponent as PlusIcon } from "assets/svgs/plus.svg";
import clsx from "clsx";
import { NavbarItem, PrimaryButton } from "components";
import React from "react";
import { useHistory } from "react-router-dom";
import useCommonStyles from "styles/common";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    left: 0,
    top: theme.custom.appHeaderHeight,
    bottom: 0,
    width: theme.custom.appNavbarWidth,
    overflowY: "auto",
    background: `url(/assets/svgs/menu_bg.svg)`,
    backgroundSize: "cover",
  },
  content: {
    padding: "24px",
    minHeight: "100%",
    position: "relative",
  },
  newFund: {
    height: 40,
    marginBottom: 15,
    "& svg": {
      width: 20,
      height: 20,
    },
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.third,
    marginTop: 24,
    marginBottom: 24,
  },
}));

export const Navbar = () => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const history = useHistory();

  const onNewFund = () => {
    history.push("/new-fund");
  };

  return (
    <div className={clsx(classes.root, commonClasses.scroll)}>
      <div className={classes.content}>
        <PrimaryButton
          className={classes.newFund}
          color="primary"
          fullWidth
          onClick={onNewFund}
          variant="contained"
        >
          <PlusIcon />
          &nbsp;New fund
        </PrimaryButton>

        <NavbarItem icon={OrverviewIcon} link="/overview" title="Overview" />
        <div className={classes.divider} />
        <NavbarItem icon={FundIcon} link="/my-funds" title="My funds" />
        <NavbarItem icon={InvestIcon} link="/my-invest" title="My invest" />

        <NavbarItem icon={ProfileIcon} link="/profile" title="Profile" />
      </div>
    </div>
  );
};
