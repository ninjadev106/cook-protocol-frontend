import { Grid, makeStyles } from "@material-ui/core";
import { FeaturedLiquidityPoolCard, Spinner } from "components";
import React from "react";
import { IPoolDetails } from "types";

const useStyles = makeStyles((theme) => ({
  root: {},

  content: {
    paddingTop: 24,
  },
}));

interface IProps {
  cks: string[];
  loading: boolean;
}

export const FeaturedLiquidityPoolsSection = (props: IProps) => {
  const classes = useStyles();
  const { cks, loading } = props;

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        {loading ? (
          <Spinner />
        ) : (
          <Grid container spacing={6}>
            {cks.map((ck) => (
              <Grid item key={ck} lg={4} md={4} xs={6}>
                <FeaturedLiquidityPoolCard ck={ck} />
              </Grid>
            ))}
          </Grid>
        )}
      </div>
    </div>
  );
};
