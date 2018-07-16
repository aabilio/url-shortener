import React from 'react'
import PropTypes from 'prop-types'
import fetch from 'isomorphic-unfetch'

import Header from '../components/Header'
import Footer from '../components/Footer'
import UrlsList from '../components/UrlsList'

import makeUrlShortenerApiClient from '../client-libs/url-shortener'

const urlShortenerApiClient = makeUrlShortenerApiClient({ fetch })
const apiClient = urlShortenerApiClient('localhost', 8000, 'http')

const DEFAULT_URL = 'http://...'

class ShortenerPage extends React.Component {
  state = {
    url: DEFAULT_URL,
    loading: false,
    lastShortsList: [],
    error: false,
    lastAddedId: null,
  }

  // In this simple example we are going to use just the state from the
  // container to store the app state (nor Redux, nor anything else).
  // So we need to pass lastShorts from server side rendering
  // props to the current component state at mounting time
  componentDidMount = () => {
    const { lastShorts } = this.props
    this.setState({ lastShortsList: lastShorts })
  }

  // Server Side Rendering first props
  static async getInitialProps() {
    return {
      lastShorts: await apiClient.getLastShortUrls(),
    }
  }

  // UX: Resseting erros on input change
  handleInputChange = event => this.setState({ url: event.target.value, error: false })

  // UX: The user just have to enter from 'http' as this is mandatory
  handelInputClick = () => {
    const { url } = this.state
    return (url === DEFAULT_URL || url === '') ? this.setState({ url: 'http' }) : null
  }

  // UX: Fire short call on enter key press
  handleInputKeyPress = (event) => {
    const keyPressed = event.key
    return (keyPressed === 'Enter') ? this.handleShortClick() : null
  }

  handleShortClick = async () => {
    const { url, loading, lastShortsList } = this.state
    if (loading) {
      return false
    }
    this.setState({ loading: true })

    const valid = await apiClient.validateDestination(url)
    if (!valid) {
      this.setState({ error: true, loading: false })
      return false
    }

    const shortUrl = await apiClient.shortUrl(url)
    shortUrl.clicks = 0
    const lastAddedId = shortUrl.id
    const newLastShortsList = [shortUrl, ...lastShortsList]
    this.setState({
      lastShortsList: newLastShortsList, url: DEFAULT_URL, loading: false,
    })
    // UX: Show last url added with colors
    window.scrollTo(0, 0)
    setTimeout(() => { this.setState({ lastAddedId }) }, 100)
    setTimeout(() => { this.setState({ lastAddedId: null }) }, 1000)

    return true
  }

  render = () => {
    // UX: Avoid first rendering data blink caused by
    // pass props to store in this basic example
    const {
      lastAddedId, lastShortsList, url, error, loading,
    } = this.state

    const { lastShorts } = this.props
    const lastsList = (lastShortsList.length === 0) ? lastShorts : lastShortsList

    return (
      <main>
        <Header
          url={url}
          error={error}
          loading={loading}
          handleInputChange={this.handleInputChange}
          handleInputKeyPress={this.handleInputKeyPress}
          handelInputClick={this.handelInputClick}
          handleShortClick={this.handleShortClick}
        />
        <section className="section__last-urls">
          <h1>Last shorten urls...</h1>
          {(lastsList.length === 0)
            ? <h1 className="section__last-urls__no-urls">There is no urls yet... <span>:(</span></h1>
            : <UrlsList urls={lastsList} lastAddedId={lastAddedId} />
          }
        </section>
        <Footer />

        <style jsx>{`
          @import url('https://fonts.googleapis.com/css?family=Ubuntu+Mono');

          * {
            font-family: 'Ubuntu Mono', monospace;
          }

          main {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: black;
          }

          section {
            margin-top: 121px;
            margin-bottom: 30px;
          }
          section h1 {
            color: #ec407a;
            padding: 10px;
            font-size: 16px;
            margin: 0;
            padding: 20px 15px 15px 15px;
          }
          section h1.section__last-urls__no-urls {
            margin: 0;
            padding: 15px;
            text-align: center;
          }
          section h1.section__last-urls__no-urls {
            color: #fec108;
          }
          section h1.section__last-urls__no-urls > span {
            color: #ef526e;
          }
        `}
        </style>
      </main>
    )
  }
}

ShortenerPage.propTypes = {
  lastShorts: PropTypes.array.isRequired,
}

export default ShortenerPage
