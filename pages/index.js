// export default () => {
//   return <div>a</div>
// }
import Head from 'next/head'
export default class Index extends React.Component {
  componentDidMount() {
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
