import { makeStyles } from "@material-ui/core";
import { ReactComponent as LogoSVG } from "assets/svgs/logo.svg";
import clsx from "clsx";
import HeaderNavbarItem from "components/Header/HeaderNavbarItem";
import React from "react";
import { NavLink } from "react-router-dom";

import { AccountInfoBar } from "../AccountInfoBar";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    left: 0,
    right: 0,
    top: 0,
    height: theme.custom.appHeaderHeight,
    backgroundColor: theme.colors.default,
    borderBottom: `1px solid ${theme.colors.default800}`,
  },
  content: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
    padding: "0 24px",
  },
  logo: {
    height: theme.spacing(3.5),
    marginLeft: theme.spacing(2),
  },
  navItems: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 80,
    height: "100%",
    "& > * + *": {
      marginLeft: 24,
    },
  },
  space: {
    flex: 1,
  },
}));

export const Header = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={clsx(classes.content)}>
        <NavLink className={classes.logo} to="/">
          <LogoSVG />
        </NavLink>
        <div className={classes.navItems}>
          <HeaderNavbarItem link="/overview" title="Fund" />
          <HeaderNavbarItem link="/mining" title="Mining" />
          <HeaderNavbarItem link="/governance" title="Governance" />
        </div>
        <div className={classes.space} />
        <AccountInfoBar />
      </div>
    </div>
  );
};
