import { Web3Provider } from "@ethersproject/providers";
import { ThemeProvider } from "@material-ui/styles";
import { Web3ReactProvider } from "@web3-react/core";
import { ConnectedWeb3, GlobalProvider, useSettings } from "contexts";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import routes, { renderRoutes } from "routes";
import { createTheme } from "theme";
import "./App.scss";

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

function App() {
  const { settings } = useSettings();
  const theme = createTheme(settings);
  return (
    <ThemeProvider theme={theme}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <ConnectedWeb3>
          <GlobalProvider>
            <BrowserRouter>{renderRoutes(routes as any)}</BrowserRouter>
          </GlobalProvider>
        </ConnectedWeb3>
      </Web3ReactProvider>
    </ThemeProvider>
  );
}

export default App;
