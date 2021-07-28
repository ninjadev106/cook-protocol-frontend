import { makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {},
}));

const ProfilePage = () => {
  const classes = useStyles();
  return <div className={classes.root}>ProfilePage</div>;
};

export default ProfilePage;
