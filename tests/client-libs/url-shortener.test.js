import makeUrlShortenerApiClient from '../../client-libs/url-shortener'

const API_HOSTANAME = 'locahost'
const API_PORT = 3000
const API_PROTOCOL = 'http'

describe('Url shortener', () => {
  let fetch
  let urlShortenerlApi
  let apiClient
  let API_URL

  beforeEach(() => {
    fetch = jest.fn()
    urlShortenerlApi = makeUrlShortenerApiClient({ fetch })
    apiClient = urlShortenerlApi(API_HOSTANAME, API_PORT, API_PROTOCOL)
    API_URL = apiClient.apiUrl
  })

  it('makeJsonFetchRequest', () => {
    const data = { test: true }
    const expected = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
    const result = apiClient.makeJsonFetchRequest(data)
    expect(result).toEqual(expected)
  })

  it('validateDestination', async () => {
    fetch.mockReturnValue({ json: () => ({ valid: true }) })
    const destination = 'test'
    const expected = true
    const result = await apiClient.validateDestination(destination)

    expect(result).toEqual(expected)
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/destination/valid?url=${destination}`)
  })

  it('shortUrl', async () => {
    const url = 'http://test.com'
    const expected = { path: 'test' }
    fetch.mockReturnValue({ json: () => expected })

    const result = await apiClient.shortUrl(url)

    expect(result).toEqual(expected)
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/url`, apiClient.makeJsonFetchRequest({ url }))
  })

  it('getShortUrlInfo', async () => {
    const path = 'test'
    const expected = { path }
    fetch.mockReturnValue({ json: () => expected })

    const result = await apiClient.getShortUrlInfo(path)

    expect(result).toEqual(expected)
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/url/${path}`)
  })

  it('getShortUrlStats', async () => {
    const path = 'test'
    const expected = { clicks: 1 }
    fetch.mockReturnValue({ json: () => expected })

    const result = await apiClient.getShortUrlStats(path)

    expect(result).toEqual(expected)
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/url/${path}/stats`)
  })

  it('getShortUrlHistory', async () => {
    const path = 'test'
    const expected = [{ path }]
    fetch.mockReturnValue({ json: () => expected })

    const result = await apiClient.getShortUrlHistory(path)

    expect(result).toEqual(expected)
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/url/${path}/history`)
  })

  it('getShortUrlHistory', async () => {
    const path = 'test'
    const expected = [{ path }]
    fetch.mockReturnValue({ json: () => expected })

    const result = await apiClient.getLastShortUrls()

    expect(result).toEqual(expected)
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/urls`)
  })
})
