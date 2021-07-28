import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import CloseIcon from "@material-ui/icons/Close";
import { ReactComponent as SearchIcon } from "assets/svgs/search.svg";
import clsx from "clsx";
import { PlATFORMS, TOKEN_ICONS } from "config/constants";
import { getToken, tokenIds } from "config/network";
import { useConnectedWeb3Context } from "contexts";
import { Form, Formik } from "formik";
import React from "react";
import useCommonStyles from "styles/common";
import { ICreateFund, KnownToken } from "types";
import * as Yup from "yup";

const useStyles = makeStyles((theme) => ({
  root: { height: "100%", position: "relative", overflow: "hidden" },
  contentWrapper: {
    backgroundColor: theme.colors.default,
    display: "flex",
    overflowY: "auto",
    height: "100%",
    paddingBottom: 80,
  },
  leftContentWrapper: {
    width: "66%",
    overflowY: "auto",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  rightContentWrapper: {
    flex: 1,
    overflowY: "auto",
    backgroundColor: theme.colors.default800,
    [theme.breakpoints.down("sm")]: {
      flex: "unset",
    },
  },
  title: {
    fontSize: 16,
    color: theme.colors.reverse,
  },
  description: {
    fontSize: 40,
    color: theme.colors.reverse,
    lineHeight: "48px",
    marginTop: 24,
  },
  comment: { fontSize: 16, color: theme.colors.default400, marginBottom: 16 },
  groupComment: {
    fontSize: 16,
    color: theme.colors.reverse,
    marginBottom: 16,
    marginTop: 32,
    fontWeight: 500,
    "&.top": {
      marginTop: 0,
    },
  },

  checkbox: {
    display: "flex",
    color: theme.colors.reverse,
    fontSize: 24,
    "& svg": {
      width: 30,
      height: 30,
      color: theme.colors.reverse,
    },
  },
  submit: {
    height: 40,
    fontSize: 14,
    textTransform: "none",
    minWidth: 260,
  },
  platforms: {
    display: "flex",
    marginTop: 8,
    flexWrap: "wrap",
    alignItems: "center",
  },
  platform: {
    display: "flex",
    alignItems: "center",
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.default700,
    marginRight: 8,
    marginBottom: 8,
    padding: "4px",
    "&:last-child": {
      marginRight: 0,
    },
    "& > svg": {
      width: 24,
      height: 24,
    },
    "& span": {
      color: theme.colors.secondary,
      fontWeight: 200,
      padding: "0 10px",
      "&:last-child": {
        height: 20,
        cursor: "pointer",
        "& svg": {
          width: 20,
          height: 20,
        },
      },
    },
  },
  assets: {
    marginTop: 8,
  },
  asset: {
    display: "flex",
    alignItems: "center",
    padding: "12px 8px",
    "& > svg": {
      width: 24,
      height: 24,
    },
    "& span": {
      flex: 1,
      fontSize: 14,
      color: theme.colors.reverse,
      padding: "0 10px",
      "&:last-child": {
        height: 20,
        flex: "unset",
        cursor: "pointer",
        "& svg": {
          width: 20,
          height: 20,
        },
      },
    },
  },
  bottom: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    backgroundColor: theme.colors.default,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "16px 24px",
  },
}));

export interface ICreateFundFormValues extends ICreateFund {
  accepted: boolean;
}

export interface IProps {
  onSubmit: (_: ICreateFund) => void;
}

export const CreateLiquidityPoolForm = (props: IProps) => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();
  const { account, setWalletConnectModalOpened } = useConnectedWeb3Context();
  const isWalletConnected = !!account;
  const initialFormValue: ICreateFundFormValues = {
    name: "",
    symbol: "",
    about: "",
    fee: 3,
    acceptedTokens: [],
    liquidityPoolType: "",
    platformWhitelist: [],
    allowLeverage: "",
    accepted: false,
  };

  return (
    <Formik
      initialValues={initialFormValue}
      onSubmit={async (values) => {
        if (!isWalletConnected) {
          setWalletConnectModalOpened(true);
          return;
        }
        props.onSubmit(values);
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string().required(),
        symbol: Yup.string().required(),
        about: Yup.string(),
        fee: Yup.number().required(),
        acceptedTokens: Yup.array().required(),
        platformWhitelist: Yup.array().required(),
        liquidityPoolType: Yup.string().required(),
        allowLeverage: Yup.string().required(),
      })}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        isValid,
        setFieldValue,
        touched,
        values,
      }) => (
        <Form className={classes.root} onSubmit={handleSubmit}>
          <div className={clsx(classes.contentWrapper, commonClasses.scroll)}>
            <div
              className={clsx(
                classes.leftContentWrapper,
                commonClasses.pageContent
              )}
            >
              <Typography className={classes.title}>Create new fund</Typography>
              <Typography className={classes.description}>
                Very long title example for liquidity
              </Typography>
              <Typography className={classes.comment}>
                This liquidity pool will invest in altcoins that have huge
                growth potential, seeking 100 times of return
              </Typography>
              <Typography className={classes.groupComment}>
                General Info
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    error={Boolean(touched.name && errors.name)}
                    fullWidth
                    helperText={touched.name && errors.name}
                    id="name"
                    label="Name"
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter name"
                    required
                    value={values.name}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    error={Boolean(touched.symbol && errors.symbol)}
                    fullWidth
                    helperText={touched.symbol && errors.symbol}
                    id="symbol"
                    label="Symbol"
                    name="symbol"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter symbol"
                    required
                    value={values.symbol}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">%</InputAdornment>
                      ),
                    }}
                    error={Boolean(touched.fee && errors.fee)}
                    fullWidth
                    helperText={touched.fee && errors.fee}
                    id="fee"
                    label="Fee %"
                    name="fee"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter fee"
                    required
                    type="number"
                    value={values.fee}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    id="allowLeverage"
                    label="Allow Leverage:"
                    name="allowLeverage"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Allow Leverage:"
                    required
                    select
                    value={values.allowLeverage}
                    variant="outlined"
                  >
                    {[
                      { label: "1x", value: "1x" },
                      { label: "3x", value: "3x" },
                      { label: "5x", value: "5x" },
                      { label: "7x", value: "6x" },
                      { label: "10x", value: "10x" },
                    ].map((e) => (
                      <MenuItem key={e.value} value={e.value}>
                        {e.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    id="liquidityPoolType"
                    label="Liquidity Pool Type:"
                    name="liquidityPoolType"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Liquidity Pool Type:"
                    required
                    select
                    value={values.liquidityPoolType}
                    variant="outlined"
                  >
                    {[{ label: "Spot - DEFI", value: "Spot - DEFI" }].map(
                      (e) => (
                        <MenuItem key={e.value} value={e.value}>
                          {e.label}
                        </MenuItem>
                      )
                    )}
                  </TextField>
                </Grid>
              </Grid>
              <Typography className={classes.groupComment}>
                Whitelists
              </Typography>

              <TextField
                InputLabelProps={{ shrink: true }}
                fullWidth
                id="platform-white-list"
                label="Platform Whitelist:"
                onChange={(e) => {
                  if (values.platformWhitelist.includes(e.target.value)) {
                    return;
                  }
                  setFieldValue("platformWhitelist", [
                    ...values.platformWhitelist,
                    e.target.value,
                  ]);
                }}
                placeholder="Add platform whitelist"
                select
                value=""
                variant="outlined"
              >
                {PlATFORMS.map((e) => (
                  <MenuItem key={e.value} value={e.value}>
                    {e.label}
                  </MenuItem>
                ))}
              </TextField>
              <div className={classes.platforms}>
                {values.platformWhitelist.map((platformValue) => {
                  const platform = PlATFORMS.find(
                    (e) => e.value === platformValue
                  );
                  const Icon = (TOKEN_ICONS as any)[platformValue];
                  if (!platform || !Icon) return null;
                  return (
                    <div className={classes.platform} key={platformValue}>
                      <Icon />
                      <span>{platform.label}</span>
                      <span
                        onClick={() => {
                          setFieldValue(
                            "platformWhitelist",
                            values.platformWhitelist.filter(
                              (e) => e !== platformValue
                            )
                          );
                        }}
                      >
                        <CloseIcon />
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div
              className={clsx(
                classes.rightContentWrapper,
                commonClasses.pageContent
              )}
            >
              <Typography className={clsx(classes.groupComment, "top")}>
                Accepted Assets
              </Typography>

              <TextField
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                fullWidth
                id="acceptedTokens"
                label="Search by symbol or name"
                onChange={(e) => {
                  if (values.acceptedTokens.includes(e.target.value)) return;
                  setFieldValue("acceptedTokens", [
                    ...values.acceptedTokens,
                    e.target.value,
                  ]);
                }}
                placeholder="Search..."
                select
                value=""
                variant="outlined"
              >
                {Object.keys(tokenIds).map((tokenId) => {
                  const token = getToken(tokenId as KnownToken);
                  return (
                    <MenuItem key={token.symbol} value={token.symbol}>
                      {token.symbol.toUpperCase()}
                    </MenuItem>
                  );
                })}
              </TextField>
              <div className={classes.assets}>
                {values.acceptedTokens.map((tokenValue) => {
                  const token = getToken(tokenValue as KnownToken);
                  const Icon = (TOKEN_ICONS as any)[tokenValue];
                  if (!token || !Icon) return null;
                  return (
                    <div className={classes.asset} key={tokenValue}>
                      <Icon />
                      <span>{token.name}</span>
                      <span
                        onClick={() => {
                          setFieldValue(
                            "acceptedTokens",
                            values.acceptedTokens.filter(
                              (e) => e !== tokenValue
                            )
                          );
                        }}
                      >
                        <CloseIcon />
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className={classes.bottom}>
            <FormControlLabel
              className={classes.checkbox}
              control={<Checkbox />}
              label="I accepted the terms & condition"
              labelPlacement="end"
              name="accepted"
              onChange={handleChange}
              value={values.accepted}
            />
            <Button
              className={clsx(classes.submit, commonClasses.primaryButton)}
              color="primary"
              disabled={!values.accepted || !isValid || isSubmitting}
              type="submit"
              variant="contained"
            >
              {isWalletConnected ? (
                <>
                  Create&nbsp;&nbsp;&nbsp;
                  <ChevronRightIcon />
                </>
              ) : (
                <>Connect Wallet and Create</>
              )}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};
