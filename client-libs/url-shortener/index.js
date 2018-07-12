const makeUrlShortenerApiClient = ({ fetch }) => (host = 'localhost', port = 80, protocol = 'http') => {
  const API_PATH = '/api'
  const API_VERSION = 'v1'
  const API_URL = `${protocol}://${host}:${port}${API_PATH}/${API_VERSION}`

  const makeJsonFetchRequest = data => ({
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  const validateDestination = async (destination) => {
    const apiPath = '/destination/valid'
    const response = await fetch(`${API_URL}${apiPath}?url=${destination}`)
    const data = await response.json()
    return data.valid || false
  }

  const shortUrl = async (url) => {
    const apiPath = '/url'
    const response = await fetch(`${API_URL}${apiPath}`, makeJsonFetchRequest({ url }))
    const data = await response.json()
    return data
  }

  const getShortUrlInfo = async (path) => {
    const apiPath = `/url/${path}`
    const response = await fetch(`${API_URL}${apiPath}`)
    const data = await response.json()
    return data
  }

  const getShortUrlStats = async (path) => {
    const apiPath = `/url/${path}/stats`
    const response = await fetch(`${API_URL}${apiPath}`)
    const data = await response.json()
    return data
  }

  const getShortUrlHistory = async (path) => {
    const apiPath = `/url/${path}/history`
    const response = await fetch(`${API_URL}${apiPath}`)
    const data = await response.json()
    return data
  }

  const getLastShortUrls = async () => {
    const apiPath = '/urls'
    const response = await fetch(`${API_URL}${apiPath}`)
    const data = await response.json()
    return data
  }

  return {
    apiUrl: API_URL,
    makeJsonFetchRequest,
    validateDestination,
    shortUrl,
    getShortUrlInfo,
    getShortUrlStats,
    getShortUrlHistory,
    getLastShortUrls,
  }
}

export default makeUrlShortenerApiClient
