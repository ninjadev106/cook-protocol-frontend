import { CircularProgress, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Highstockcharts from "highcharts/highstock";
import React, { useEffect, useState } from "react";
import { IPoolDetails } from "types";
import { getCoinsChartData } from "utils/token";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.colors.transparent,
    borderRadius: 10,
    margin: "4px 8px",
  },
  chart: {
    textAlign: "center",
  },
}));

interface IProps {
  className?: string;
  data: IPoolDetails;
}

interface IState {
  loading: boolean;
  priceData: Array<Array<number>>;
}

export const FundChart = (props: IProps) => {
  const classes = useStyles();
  const { data } = props;

  const [state, setState] = useState<IState>({ loading: true, priceData: [] });

  useEffect(() => {
    let isMounted = true;

    const loadInfo = async () => {
      setState((prev) => ({ ...prev, loading: true }));
      const chartInfo = await getCoinsChartData(data.tokens, data.ckTokens);
      if (isMounted) {
        setState((prev) => ({ ...prev, loading: false, priceData: chartInfo }));
      }
    };
    loadInfo();

    return () => {
      isMounted = false;
    };
  }, [data.id]);

  const options: Highcharts.Options = {
    title: { text: "" },
    chart: {
      backgroundColor: "#0000",
      zoomType: "x",
      height: 140,
    },
    rangeSelector: {
      enabled: undefined,
      buttonPosition: { align: "right" },
      buttonTheme: {
        stroke: "#09092B",
        fill: "#0000",
      },
      inputPosition: { align: "left" },
    },
    yAxis: [
      {
        startOnTick: false,
        endOnTick: false,
        labels: {
          align: "right",
          x: -3,
        },
        title: {
          text: "",
        },
        height: "100%",
        lineWidth: 0,
        gridLineWidth: 0,
        resize: {
          enabled: true,
        },
        visible: false,
      },
    ],

    xAxis: {
      zoomEnabled: true,
      type: "datetime",
      gridLineWidth: 0,
      lineWidth: 0,
      tickWidth: 0,
      visible: false,
    },

    tooltip: {
      split: true,
    },

    legend: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },

    navigator: {
      enabled: false,
      outlineWidth: 0,
      handles: {
        borderColor: "#0000",
      },
    },

    scrollbar: {
      enabled: false,
      barBackgroundColor: "#A6A9B7",
      trackBackgroundColor: "#A6A9B755",
      barBorderColor: "#A6A9B7",
      trackBorderColor: "#A6A9B755",
    },

    series: [
      {
        type: "line",
        name: "Price",
        pointStart:
          state.priceData.length > 0 ? state.priceData[0][0] : Date.now(),
        pointInterval: 24 * 3600 * 1000,
        data: state.priceData,
        color: "#57CBA8",
      },
    ],
  };

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.chart}>
        {state.loading ? (
          <CircularProgress color="primary" size={32} />
        ) : (
          <HighchartsReact
            constructorType={"stockChart"}
            highcharts={Highstockcharts}
            options={options}
          />
        )}
      </div>
    </div>
  );
};
