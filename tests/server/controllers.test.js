import makeControllers, {
  isString,
} from '../../server/controllers'

describe('API Controllers', () => {
  let utils
  let req
  let res
  let next
  let controllers

  beforeEach(() => {
    utils = {
      getLastGeneralShortUrl: jest.fn(),
      validateDestination: jest.fn(),
      getUrlShortHistory: jest.fn(),
      getShortUrlByPath: jest.fn(),
      getUrlShortStats: jest.fn(),
      logGateway: jest.fn(),
      short: jest.fn(),
    }
    req = {
      params: {},
      query: {},
      body: {},
    }
    res = {
      redirect: jest.fn(),
      status: jest.fn(),
      json: jest.fn(),
    }
    next = jest.fn()
    controllers = makeControllers({ utils })
  })

  it('isString success', () => {
    const expected = true
    const result = isString('test')
    expect(result).toEqual(expected)
  })

  it('isString fail', () => {
    const expected = false
    const result = isString(1)
    expect(result).toEqual(expected)
  })

  it('validateDestinationController success', async () => {
    utils.validateDestination.mockReturnValue(true)
    res.json.mockImplementation(data => data)
    req.query.url = 'http://test.com'

    const expected = { valid: true }
    const result = await controllers.validateDestinationController(req, res)

    expect(result).toEqual(expected)
    expect(res.json).toHaveBeenCalledTimes(1)
    expect(utils.validateDestination).toHaveBeenCalledTimes(1)
  })

  it('validateDestinationController error', async () => {
    const jsonFromStatus = jest.fn()
    jsonFromStatus.mockImplementation(data => data)
    utils.validateDestination.mockReturnValue(false)
    res.status.mockImplementation(() => ({ json: jsonFromStatus }))
    req.query.url = undefined

    const expected = { error: 'destination not valid' }
    const result = await controllers.validateDestinationController(req, res)

    expect(result).toEqual(expected)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(jsonFromStatus).toHaveBeenCalledTimes(1)
    expect(jsonFromStatus).toHaveBeenCalledWith(expected)
  })

  it('shortController success', async () => {
    utils.validateDestination.mockReturnValue(true)
    utils.short.mockReturnValue({ path: 'test' })
    res.json.mockImplementation(data => data)
    req.body.url = 'http://test.com'

    const expected = { path: 'test' }
    const result = await controllers.shortController(req, res)

    expect(result).toEqual(expected)
    expect(res.json).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({ path: 'test' })
    expect(utils.validateDestination).toHaveBeenCalledTimes(1)
    expect(utils.validateDestination).toHaveBeenCalledWith('http://test.com')
  })

  it('shortController not valid destination error (validateDestination)', async () => {
    const jsonFromStatus = jest.fn()
    jsonFromStatus.mockImplementation(data => data)
    utils.validateDestination.mockReturnValue(false)
    res.status.mockImplementation(() => ({ json: jsonFromStatus }))
    res.json.mockImplementation(data => data)
    // req.body.url = 'http://google.es'

    const expected = { error: 'destination not valid' }
    const result = await controllers.shortController(req, res)

    expect(result).toEqual(expected)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(jsonFromStatus).toHaveBeenCalledTimes(1)
    expect(jsonFromStatus).toHaveBeenCalledWith(expected)
  })

  it('shortController not valid destination error (isString)', async () => {
    const jsonFromStatus = jest.fn()
    jsonFromStatus.mockImplementation(data => data)
    // utils.validateDestination.mockReturnValue(false)
    res.status.mockImplementation(() => ({ json: jsonFromStatus }))
    res.json.mockImplementation(data => data)
    req.body.url = undefined

    const expected = { error: 'destination not valid' }
    const result = await controllers.shortController(req, res)

    expect(result).toEqual(expected)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(jsonFromStatus).toHaveBeenCalledTimes(1)
    expect(jsonFromStatus).toHaveBeenCalledWith(expected)
    expect(utils.validateDestination).toHaveBeenCalledTimes(0)
  })

  it('gatewayController', async () => {
    req.params.path = 'http://test.com'
    utils.getShortUrlByPath.mockReturnValue({
      path: 'test',
      destination: 'http://test',
      active: true,
    })

    await controllers.gatewayController(req, res, next)

    expect(res.redirect).toHaveBeenCalledTimes(1)
    expect(res.redirect).toHaveBeenCalledWith('http://test')
    expect(utils.logGateway).toHaveBeenCalledTimes(1)
    expect(utils.getShortUrlByPath).toHaveBeenCalledWith(req.params.path)
    expect(utils.getShortUrlByPath).toHaveBeenCalledTimes(1)
  })

  it('gatewayController with not found path', async () => {
    req.params.path = 'http://test.com'
    utils.getShortUrlByPath.mockReturnValue(null)

    await controllers.gatewayController(req, res, next)

    expect(next).toHaveBeenCalledTimes(1)
    expect(res.redirect).toHaveBeenCalledTimes(0)
    expect(utils.logGateway).toHaveBeenCalledTimes(0)
    expect(utils.getShortUrlByPath).toHaveBeenCalledWith(req.params.path)
    expect(utils.getShortUrlByPath).toHaveBeenCalledTimes(1)
  })

  it('gatewayController with not active short url', async () => {
    req.params.path = 'http://test.com'
    utils.getShortUrlByPath.mockReturnValue({
      path: 'test',
      destination: 'http://test',
      active: false,
    })

    await controllers.gatewayController(req, res, next)

    expect(next).toHaveBeenCalledTimes(1)
    expect(res.redirect).toHaveBeenCalledTimes(0)
    expect(utils.logGateway).toHaveBeenCalledTimes(0)
    expect(utils.getShortUrlByPath).toHaveBeenCalledWith(req.params.path)
    expect(utils.getShortUrlByPath).toHaveBeenCalledTimes(1)
  })

  it('infoController', async () => {
    const returnedData = {
      path: 'test',
      destination: 'http://test',
      active: true,
    }
    req.params.path = 'http://test.com'
    utils.getShortUrlByPath.mockReturnValue(returnedData)
    res.json.mockImplementation(data => data)

    const expected = returnedData
    const result = await controllers.infoController(req, res)

    expect(result).toEqual(expected)
    expect(res.json).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith(returnedData)
    expect(utils.getShortUrlByPath).toHaveBeenCalledWith(req.params.path)
    expect(utils.getShortUrlByPath).toHaveBeenCalledTimes(1)
  })

  it('infoController with not path', async () => {
    const jsonFromStatus = jest.fn()
    req.params.path = undefined
    jsonFromStatus.mockImplementation(data => data)
    res.status.mockImplementation(() => ({ json: jsonFromStatus }))
    res.json.mockImplementation(data => data)

    const expected = { error: 'bad path' }
    const result = await controllers.infoController(req, res)

    expect(result).toEqual(expected)
    expect(res.json).toHaveBeenCalledTimes(0)
    expect(utils.getShortUrlByPath).toHaveBeenCalledTimes(0)
  })

  it('statsController', async () => {
    const returnedData = { clicks: 1 }
    req.params.path = 'http://test.com'
    utils.getUrlShortStats.mockReturnValue(returnedData)
    res.json.mockImplementation(data => data)

    const expected = returnedData
    const result = await controllers.statsController(req, res)

    expect(result).toEqual(expected)
    expect(res.json).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith(returnedData)
    expect(utils.getUrlShortStats).toHaveBeenCalledWith(req.params.path)
    expect(utils.getUrlShortStats).toHaveBeenCalledTimes(1)
  })

  it('statsController with not path', async () => {
    const jsonFromStatus = jest.fn()
    req.params.path = undefined
    jsonFromStatus.mockImplementation(data => data)
    res.status.mockImplementation(() => ({ json: jsonFromStatus }))
    res.json.mockImplementation(data => data)

    const expected = { error: 'bad path' }
    const result = await controllers.statsController(req, res)

    expect(result).toEqual(expected)
    expect(res.json).toHaveBeenCalledTimes(0)
    expect(utils.getUrlShortStats).toHaveBeenCalledTimes(0)
  })

  it('historyController', async () => {
    const returnedData = [{ path: 'test' }]
    req.params.path = 'http://test.com'
    utils.getUrlShortHistory.mockReturnValue(returnedData)
    res.json.mockImplementation(data => data)

    const expected = returnedData
    const result = await controllers.historyController(req, res)

    expect(result).toEqual(expected)
    expect(res.json).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith(returnedData)
    expect(utils.getUrlShortHistory).toHaveBeenCalledWith(req.params.path)
    expect(utils.getUrlShortHistory).toHaveBeenCalledTimes(1)
  })

  it('historyController with not path', async () => {
    const jsonFromStatus = jest.fn()
    req.params.path = undefined
    jsonFromStatus.mockImplementation(data => data)
    res.status.mockImplementation(() => ({ json: jsonFromStatus }))
    res.json.mockImplementation(data => data)

    const expected = { error: 'bad path' }
    const result = await controllers.historyController(req, res)

    expect(result).toEqual(expected)
    expect(res.json).toHaveBeenCalledTimes(0)
    expect(utils.getUrlShortHistory).toHaveBeenCalledTimes(0)
  })

  it('lastShortUrlsController', async () => {
    const returnedData = [{ path: 'test' }]
    utils.getLastGeneralShortUrl.mockReturnValue(returnedData)
    res.json.mockImplementation(data => data)

    const expected = returnedData
    const result = await controllers.lastShortUrlsController(req, res)

    expect(result).toEqual(expected)
    expect(res.json).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith(returnedData)
    expect(utils.getLastGeneralShortUrl).toHaveBeenCalledTimes(1)
  })
})
