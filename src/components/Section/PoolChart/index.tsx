import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import mockData from "config/chartmock.json";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Highstockcharts from "highcharts/highstock";
import { transparentize } from "polished";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.colors.default,
  },
  chart: {
    marginTop: 20,
    position: "relative",
  },
  chartTitle: {
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 1,
    display: "flex",
    alignItems: "center",
    "& > * + *": { marginLeft: 8 },
    "& span": {
      fontSize: 30,
      lineHeight: 1.5,
      "&:first-child": {
        color: theme.colors.primary,
      },
      "&:last-child": {
        fontSize: 14,
        display: "inline-block",
        backgroundColor: transparentize(0.9, theme.colors.success),
        color: theme.colors.success,
        padding: "8px 12px",
        borderRadius: 24,
      },
      "&:nth-child(2)": {
        color: theme.colors.secondary,
      },
    },
  },
}));

interface IProps {
  className?: string;
}

export const PoolChart = (props: IProps) => {
  const classes = useStyles();

  const options: Highcharts.Options = {
    title: { text: "" },
    chart: {
      backgroundColor: "#0000",
      zoomType: "x",
      height: 250,
    },
    rangeSelector: {
      buttonPosition: { align: "right" },
      buttonTheme: {
        stroke: "#A6A9B7",
        fill: "#0000",
      },
      inputEnabled: false,
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
        gridLineColor: "#0000",
      },
    ],

    xAxis: {
      zoomEnabled: true,
      type: "datetime",
      gridLineWidth: 0,
      lineWidth: 0,
      tickWidth: 0,
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
        pointStart: mockData[0][0],
        pointInterval: 24 * 3600 * 1000,
        data: mockData,
        color: "#57CBA8",
      },
    ],
  };

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.chart}>
        <HighchartsReact
          constructorType={"stockChart"}
          highcharts={Highstockcharts}
          options={options}
        />
        <div className={classes.chartTitle}>
          <span>340,226.10</span>
          <span>USD</span>
          <span>+$361.12</span>
        </div>
      </div>
    </div>
  );
};
