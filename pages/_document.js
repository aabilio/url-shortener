import Document, { Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <html lang="en">
        <Head>
          <title>Url Shortener - @aabilio</title>
          <meta name="theme-color" content="#ffc107" />
          <meta name="viewport" content="initial-scale=1.0, width=device-width" key="viewport" />
        </Head>
        <body style={{ background: 'rgba(255, 193, 7, .7)' }}>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
