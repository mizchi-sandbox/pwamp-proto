import Head from 'next/head'
export default class Index extends React.Component {
  componentDidMount() {
    // Run on non-amp page
    console.log('main')
  }
  render() {
    return (
      <div>
        <Head>
          <title>My page title</title>
        </Head>
        Index
      </div>
    )
  }
}
