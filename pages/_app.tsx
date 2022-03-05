import "styles/global.css";
import { ThemeProvider } from "next-themes";
import { AppProps } from "next/app";
import { Provider as ReactRedux } from "react-redux";
import { store } from "store/store";

function App({ Component, pageProps }: AppProps) {
  return (
    <ReactRedux store={store}>
      <ThemeProvider defaultTheme="system" attribute="class">
        <Component {...pageProps} />
      </ThemeProvider>
    </ReactRedux>
  );
}

export default App;
