import Head from 'next/head'
export default class Index extends React.Component {
  state = {
    mounted: false
  }
  componentWillMount() {
    // Run on non-amp page
    this.setState({ mounted: true })
  }

  async componentDidMount() {
    // no serviceWorker env
    if (!navigator.serviceWorker) {
      return
    }

    let reg = await navigator.serviceWorker.getRegistration()
    if (reg) {
      await reg.update()
    } else {
      console.log('ui: No serviceWorker. Start register')
      reg = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      })
      console.log('ui: sw registered')
    }
    reg.addEventListener('updatefound', async () => {
      console.log('ui: sw-updatefound', reg.installing)
      await reg.update()
    })
  }

  render() {
    return (
      <div>
        <Head>
          <title>My page title</title>
        </Head>
        <h1>Index</h1>
        {// this.state.mounted && 'JS runnable'
        this.state.mounted &&
          <div>
            <p>JS runnable</p>
            <div>
              preload image: =&gt;
              <img src="/static/1024kb.jpg" width="500px" />
            </div>
          </div>}
      </div>
    )
  }
}
