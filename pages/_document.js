import React from 'react'
import Document, { Head, Main, NextScript } from 'next/document'
import flush from 'styled-jsx/server'
import { parse } from 'url'

const AmpHeadContent = (originalUrl, titleText) => `
<meta charset="utf-8" >
<meta name="viewport" content="width=device-width,minimum-scale=1" >
<title>${titleText}</title>
<link rel="canonical" href='${originalUrl}' >
<style amp-custom="">body {font-family: Roboto, sans-serif; padding: 30px; color: #444;} h1 {margin-bottom: 5px;} .byline { color: #aaa; margin-bottom: 25px; } p {font-size: 18px; line-height: 30px; margin-top: 30px;} .caption {color: #ccc; margin-top: 0; font-size: 14px; text-align: center;}</style>
<style amp-boilerplate="">body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}</style>
<noscript>
  <style amp-boilerplate="">body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style>
</noscript>
<script async src="https://cdn.ampproject.org/v0.js" ></script>
<script async custom-element="amp-install-serviceworker" src="https://cdn.ampproject.org/v0/amp-install-serviceworker-0.1.js"></script>
`

export default class MyDocument extends Document {
  static getInitialProps(ctx) {
    const { renderPage, req } = ctx
    const url = req.url
    const isAmp = !!(req && req.url.indexOf('amp') > -1)
    const result = renderPage()
    const styles = flush()
    return { ...result, isAmp, url }
  }

  render() {
    const { html, isAmp, url } = this.props
    const htmlProps = isAmp ? { amp: '' } : {}
    const originalUrl = parse(url).pathname

    // Extract title from head object
    const titleEl = this.props.head.find(i => i.type === 'title')
    const titleText = titleEl ? titleEl.props.children : url
    const HOST = 'http://localhost:3000'

    return (
      <html {...htmlProps}>
        {/* Head */}
        {isAmp
          ? <head
              dangerouslySetInnerHTML={{
                __html: AmpHeadContent(originalUrl, titleText)
              }}
            />
          : <Head>
              <meta charSet="utf-8" />
              <link rel="canonical" href={originalUrl} />
            </Head>}
        {/* Body */}
        {isAmp
          ? <body>
              <p>This is amp page</p>
              <a href={originalUrl}>Go to original</a>
              <hr />
              <div id="__next" dangerouslySetInnerHTML={{ __html: html }} />
              <amp-install-serviceworker
                src={`${HOST}/sw.js`}
                data-iframe-src={HOST}
                layout="nodisplay"
              />
            </body>
          : <body>
              <Main />
              <NextScript />
            </body>}
      </html>
    )
  }
}
