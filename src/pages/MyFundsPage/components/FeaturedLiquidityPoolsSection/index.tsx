import { Grid, makeStyles } from "@material-ui/core";
import { FeaturedLiquidityPoolCard } from "components";
import React from "react";
import { IPoolDetails } from "types";

const useStyles = makeStyles((theme) => ({
  root: {},

  content: {
    paddingTop: 24,
  },
}));

interface IProps {
  pools: IPoolDetails[];
}

export const FeaturedLiquidityPoolsSection = (props: IProps) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <Grid container spacing={6}>
          {/* {props.pools.map((pool) => (
            <Grid item key={pool.id} lg={4} md={4} xs={6}>
              <FeaturedLiquidityPoolCard data={pool} />
            </Grid>
          ))} */}
        </Grid>
      </div>
    </div>
  );
};
