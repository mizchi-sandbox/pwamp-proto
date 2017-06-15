import React from 'react'
import ReactDOM from 'react-dom/server'
import Document, { Head, Main, NextScript } from 'next/document'
import { DOMProperty } from 'react-dom/lib/ReactInjection'
import { properties as DOMProperties } from 'react-dom/lib/DOMProperty'
import flush from 'styled-jsx/server'
import { parse } from 'url'

if (typeof DOMProperties.amp === 'undefined') {
  DOMProperty.injectDOMPropertyConfig({
    Properties: { amp: DOMProperty.MUST_USE_ATTRIBUTE },
    isCustomAttribute: attributeName => attributeName.startsWith('amp-')
  })
}

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
    const title = this.props.head.find(i => i.type === 'title')

    return (
      <html {...htmlProps}>
        {/* Head */}
        {isAmp
          ? <head>
              <meta charSet="utf-8" />
              <link rel="canonical" href={originalUrl} />
              <style amp-custom="">{`body {font-family: Roboto, sans-serif; padding: 30px; color: #444;} h1 {margin-bottom: 5px;} .byline { color: #aaa; margin-bottom: 25px; } p {font-size: 18px; line-height: 30px; margin-top: 30px;} .caption {color: #ccc; margin-top: 0; font-size: 14px; text-align: center;}`}</style>
              <style amp-boilerplate="">{`body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}`}</style>
              <noscript>
                <style amp-boilerplate="">{`body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}`}</style>
              </noscript>
              <meta
                name="viewport"
                content="width=device-width,minimum-scale=1"
              />
              <script async src="https://cdn.ampproject.org/v0.js" />
            </head>
          : <head>
              <meta charSet="utf-8" />
              <link rel="canonical" href={originalUrl} />
            </head>}
        {/* Body */}
        {isAmp
          ? <body>
              <p>This is amp page</p>
              <a href={originalUrl}>Go to original</a>
              <hr />
              <div id="__next" dangerouslySetInnerHTML={{ __html: html }} />
            </body>
          : <body>
              <Main />
              <NextScript />
            </body>}
      </html>
    )
  }
}
