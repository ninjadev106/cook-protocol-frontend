import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import useCommonStyles from "styles/common";

import { Header, Navbar } from "./components";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.custom.appHeaderHeight,
    height: "100vh",
    paddingLeft: theme.custom.appNavbarWidth,
  },
  content: {
    paddingLeft: 1,
    height: "100%",
    background: theme.colors.default,
    overflowY: "auto",
  },
}));

interface IProps {
  children: React.ReactNode | React.ReactNode[];
}

export const MainLayout = (props: IProps) => {
  const commonClasses = useCommonStyles();
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Header />
      <Navbar />
      <main className={clsx(classes.content, commonClasses.scroll)}>
        {props.children}
      </main>
    </div>
  );
};
