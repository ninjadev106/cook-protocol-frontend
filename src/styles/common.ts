import { makeStyles } from "@material-ui/core";
import { transparentize } from "polished";

const useCommonStyles = makeStyles((theme) => ({
  scroll: {
    "&::-webkit-scrollbar": {
      width: theme.spacing(0.5),
      boxShadow: `inset 0 0 6px ${transparentize(0.3, theme.colors.default)}`,
    },
    "&::-webkit-scrollbar-track": {},
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: theme.colors.default500,
    },
  },
  scrollHorizontal: {
    "&::-webkit-scrollbar": {
      height: theme.spacing(0.25),
      boxShadow: `inset 0 0 6px ${transparentize(0.3, theme.colors.default)}`,
    },
    "&::-webkit-scrollbar-track": {},
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: theme.colors.default500,
    },
  },
  transparentButton: {
    backgroundColor: transparentize(0.9, theme.colors.default),
    borderRadius: theme.spacing(0.75),
    color: theme.colors.default,
    "&:hover": {
      backgroundColor: transparentize(0.5, theme.colors.default),
    },
  },
  textAlignRight: {
    textAlign: "right",
  },
  row: {
    display: "flex",
    alignItems: "center",
  },
  fadeAnimation: {
    transition: "all 1s",
    opacity: 0,
    "&.visible": {
      opacity: 1,
    },
  },
  hideBelowWide: {
    [theme.breakpoints.down("sm")]: {
      display: "none !important",
    },
  },
  showBelowWide: {
    [theme.breakpoints.up("md")]: {
      display: "none !important",
    },
  },
  maxHeightTransition: {
    overflow: "hidden",
    maxHeight: 0,
    transition: "max-height 0.5s cubic-bezier(0, 1, 0, 1)",
    "&.visible": {
      maxHeight: 2000,
      transition: "max-height 1s ease-in-out",
    },
  },
  limitedContent: {
    margin: "auto",
  },
  pageContent: {
    padding: "32px 24px",
  },
  table: {
    overflowX: "auto",
    "& table": {
      borderCollapse: "separate",
      borderSpacing: "0 20px",
      "& thead": {
        "& tr": {
          "& th": {
            borderBottom: "none",
            color: transparentize(0.5, theme.colors.primary),
            fontSize: 20,
            lineHeight: "26px",
          },
        },
      },
      "& tbody": {
        "& tr": {
          cursor: "pointer",
          transition: "all 0.3s",
          "&:hover": {
            opacity: 0.7,
          },
          "& td": {
            borderBottom: "none",
            backgroundColor: theme.colors.default,
            fontSize: 20,
            lineHeight: "26px",
            "& span": {
              borderRadius: 2,
              display: "inline-flex",
              alignItems: "center",
              padding: "9px 16px",
            },
          },
          "&.positive": {
            "& td": {
              "&:first-child": {
                borderLeft: `5px solid ${theme.colors.success}`,
                borderRadius: "4px 0 0 4px",
              },
              "&:last-child": {
                borderRadius: "0 4px 4px 0",
              },
            },
            "& span": {
              color: theme.colors.success,
              backgroundColor: transparentize(0.8, theme.colors.success),
            },
          },
          "&.negative": {
            "& td": {
              "&:first-child": {
                borderLeft: `5px solid ${theme.colors.warn}`,
                borderRadius: "4px 0 0 4px",
              },
              "&:last-child": {
                borderRadius: "0 4px 4px 0",
              },
            },
            "& span": {
              color: theme.colors.warn,
              backgroundColor: transparentize(0.8, theme.colors.warn),
            },
          },
        },
      },
    },
  },
  textRight: {
    textAlign: "right",
  },
  textCenter: {
    textAlign: "center",
  },
  textLeft: {
    textAlign: "left",
  },
  primaryButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: theme.colors.textBackground1,
    color: theme.colors.reverse,
    border: "none",
    "& span": {
      textTransform: "none",
    },
    "&:hover": {
      border: "none",
      boxShadow: theme.colors.boxShadow1,
    },
  },
}));

export default useCommonStyles;
