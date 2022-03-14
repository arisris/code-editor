import Document, { Html, Head, Main, NextScript } from "next/document";
export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/favicon/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon/favicon-16x16.png"
          />
          <link rel="manifest" href="/favicon/site.webmanifest" />
          {/* <meta
            name="google-site-verification"
            content="HqRlPHb6rKQHLdM0ifiL0wHexR1qaUVFr_5f0dr0bKI"
          /> */}
        </Head>
        <body className="bg-white dark:bg-gray-900 text-black dark:text-white overflow-hidden">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
