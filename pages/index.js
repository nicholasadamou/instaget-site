import Head from 'next/head'
import { PureComponent } from 'react'
import AutosizeInput from 'react-input-autosize'

class Index extends PureComponent {

  constructor (props) {
    super(props)

    this.state = {
      value: '',
      status: '',
      link: ''
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  setStatus = (code) => {
    let status = ''
    if (code === 404) status = '❌ User could not be found.'
    else status = '⚠️ Something went wrong. Please try again.'
    this.setState({ status: status })
  }

  getLink = async (username) => {
    fetch(`/api/${username.toLowerCase()}`)
      .then(res => res.json())
      .then(data => {
        if (data.error !== undefined) this.setStatus(data.error.status)
        else window.location.href = data.link
      })
      .catch(error => {
        this.setStatus(error.statusCode)
      })
  }

  handleChange(event) {
    this.setState({value: event.target.value})
  }

  async handleSubmit(event) {
    event.preventDefault()
    this.setState({ status: '⏳Hang on, redirecting...' })
    await this.getLink(this.state.value)
  }

  render() {
    const { value, status } = this.state

    const settings = {
      type: 'text',
      value: value,
      onChange: this.handleChange,
      placeholder: '🔎 Enter Username and Press Enter',
      autoComplete: 'off',
      autoCorrect: 'off',
      spellCheck: false,
      style: { width: '100%' }
    }

    return (
      <main>
        <Head>
          <title>Instaget - View full size Instagram profile pics</title>
          <link rel='icon' type='image/png' href='/static/favicon.png' />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, user-scalable=no"
          />
          <meta name="google-site-verification" content="" />
          <link rel='stylesheet' href='/static/index.css' />
          <link href="https://fonts.googleapis.com/css?family=Montserrat&display=swap" rel="stylesheet" />
        </Head>

        <section>
          <form onSubmit={this.handleSubmit}>
            <AutosizeInput {...settings} />
          </form>

          <p>{status}</p>
        </section>
      </main>
    )
  }
}

export default Index
