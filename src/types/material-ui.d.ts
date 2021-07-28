import { Theme } from "@material-ui/core/styles/createMuiTheme";

declare module "@material-ui/core/styles/createMuiTheme" {
  interface Theme {
    custom: {
      appHeaderHeight: React.CSSProperties["height"];
      appNavbarWidth: React.CSSProperties["width"];
    };
    colors: {
      transparent: string;
      default: string;
      default50: string;
      default75: string;
      default100: string;
      default200: string;
      default300: string;
      default400: string;
      default500: string;
      default600: string;
      default700: string;
      default800: string;

      reverse: string;
      primary: string;
      primary400: string;
      primary600: string;
      primary700: string;
      primary800: string;
      primary900: string;

      secondary: string;
      third: string;
      fourth: string;
      gray10: string;
      gray20: string;
      gray30: string;
      gray40: string;
      warn: string;
      warn50: string;
      warn100: string;
      warn200: string;
      warn300: string;
      warn400: string;

      negative: string;

      success: string;
      neutral900: string;
      spin: string;

      gradient1: string;
      gradient2: string;

      textBackground1: string;

      boxShadow1: string;
    };
  }
  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    custom: {
      appHeaderHeight: React.CSSProperties["height"];
      appNavbarWidth: React.CSSProperties["width"];
    };
    colors: {
      transparent: string;
      default: string;
      default50: string;
      default75: string;
      default100: string;
      default200: string;
      default300: string;
      default400: string;
      default500: string;
      default600: string;
      default700: string;
      default800: string;

      reverse: string;
      primary: string;
      primary400: string;
      primary600: string;
      primary700: string;
      primary800: string;
      primary900: string;

      secondary: string;
      third: string;
      fourth: string;
      gray10: string;
      gray20: string;
      gray30: string;
      gray40: string;
      warn: string;
      warn50: string;
      warn100: string;
      warn200: string;
      warn300: string;
      warn400: string;

      negative: string;

      success: string;
      neutral900: string;
      spin: string;

      gradient1: string;
      gradient2: string;

      textBackground1: string;
      boxShadow1: string;
    };
  }
}
