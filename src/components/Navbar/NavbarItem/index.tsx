import { makeStyles } from "@material-ui/core";
import { transparentize } from "polished";
import React from "react";
import { NavLink, matchPath, useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    textDecoration: "none",
    color: transparentize(0.3, theme.colors.reverse),
    height: 24,
    transition: "all 0.5s",
    display: "flex",
    alignItems: "center",
    fontSize: 16,
    lineHeight: "24px",
    fontWeight: 300,
    "& svg": {
      marginRight: 16,
    },
    "&:hover": {
      opacity: 0.7,
    },
    "&.active": {
      color: theme.colors.reverse,
    },
    "& + &": {
      marginTop: 24,
    },
  },
}));

interface IProps {
  title: string;
  link: string;
  icon: React.ElementType;
}

export const NavbarItem = (props: IProps) => {
  const classes = useStyles();
  const { icon: Icon, link, title } = props;
  const history = useHistory();
  const isActive = () =>
    !!matchPath(history.location.pathname, { path: link, exact: false });
  return (
    <NavLink className={classes.root} isActive={isActive} to={link}>
      <Icon />
      {title}
    </NavLink>
  );
};
