import { Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { useConnectedWeb3Context } from "contexts";
import { useAllCks, useFeaturedCks } from "helpers";
import React from "react";
import useCommonStyles from "styles/common";

import {
  FeaturedLiquidityPoolsSection,
  PoolsSection,
  TopSection,
} from "./components";

const useStyles = makeStyles((theme) => ({
  root: {},
  subTitle: {
    color: theme.colors.reverse,
    fontSize: 16,
    lineHeight: 1.5,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 16,
  },
}));

const OverviewPage = () => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const { library: provider, networkId } = useConnectedWeb3Context();
  const { cks: featuredCks, loading: featuresCksLoading } = useFeaturedCks(
    provider,
    networkId
  );

  const { cks: allCks, loading: allCksLoading } = useAllCks(
    provider,
    networkId
  );

  return (
    <div className={clsx(classes.root, commonClasses.pageContent)}>
      <TopSection />
      <Typography className={classes.subTitle}>Top Funds</Typography>
      <FeaturedLiquidityPoolsSection
        cks={featuredCks}
        loading={featuresCksLoading}
      />
      <Typography className={classes.subTitle}>All Funds</Typography>
      <PoolsSection cks={allCks} loading={allCksLoading} />
    </div>
  );
};

export default OverviewPage;
