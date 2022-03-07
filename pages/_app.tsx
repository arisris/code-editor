import "styles/global.css";
import { ThemeProvider } from "next-themes";
import { AppProps } from "next/app";
import { Provider as ReactRedux } from "react-redux";
import { store } from "store/store";
import { UseModalConextProvider } from "hooks/useModal";

function App({ Component, pageProps }: AppProps) {
  return (
    <ReactRedux store={store}>
      <ThemeProvider defaultTheme="system" attribute="class">
        <UseModalConextProvider>
          <Component {...pageProps} />
        </UseModalConextProvider>
      </ThemeProvider>
    </ReactRedux>
  );
}

export default App;
