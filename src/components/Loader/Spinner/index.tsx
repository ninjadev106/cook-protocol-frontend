import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { waitSeconds } from "utils";

const DOT_SIZE = 12;
const DOT_SPACE = 11;

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "16px 0",
  },
  content: {
    height: 15,
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    "& > * + *": {
      marginLeft: DOT_SPACE,
    },
  },
  item: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    backgroundColor: theme.colors.spin,
    borderRadius: "50%",
    transition: "all 0.7s",
    bottom: 0,
    position: "relative",
    "&.active": {
      opacity: 0.4,
      bottom: DOT_SPACE,
    },
  },
}));

interface IProps {
  className?: string;
  dotCount?: number;
}

interface IState {
  activeIndex: number;
}

export const Spinner = (props: IProps) => {
  const classes = useStyles();
  const [state, setState] = useState<IState>({ activeIndex: 0 });
  const { dotCount = 4 } = props;

  useEffect(() => {
    let isMounted = true;

    const asyncUpdate = async () => {
      while (isMounted) {
        await waitSeconds(0.4);
        if (isMounted)
          setState((prev) => ({
            activeIndex: (prev.activeIndex + 1) % dotCount,
          }));
      }
    };

    asyncUpdate();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className={clsx(classes.root, props.className)}>
      <div className={classes.content}>
        {new Array(dotCount).fill(0).map((value, index) => {
          return (
            <div
              className={clsx(
                classes.item,
                state.activeIndex === index ? "active" : ""
              )}
              key={index}
            ></div>
          );
        })}
      </div>
    </div>
  );
};
