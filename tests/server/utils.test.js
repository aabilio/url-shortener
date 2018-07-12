import makeUtils from '../../server/utils'

describe('API Utils', () => {
  let models
  let utils

  beforeEach(() => {
    models = {
      ShortUrl: {
        create: jest.fn(),
        findOne: jest.fn(),
        findAll: jest.fn(),
      },
      LogUrl: {
        create: jest.fn(),
        count: jest.fn(),
        findAll: jest.fn(),
      },
    }
    utils = makeUtils({ models })
  })

  it('validateDestination true', () => {
    const destination = 'http://test.es'
    const expected = true
    const result = utils.validateDestination(destination)

    expect(result).toEqual(expected)
  })

  it('validateDestination false', () => {
    const destination = 'test.es'
    const expected = false
    const result = utils.validateDestination(destination)

    expect(result).toEqual(expected)
  })

  it('short with invalid destination', async () => {
    const destination = undefined
    const expected = new Error('Invalid destination')
    const result = await utils.short(destination)

    expect(result).toEqual(expected)
  })

  it('short success', async () => {
    const shortUrlUdSave = jest.fn()
    models.ShortUrl.create.mockReturnValue({
      id: 1,
      path: 'test',
      save: shortUrlUdSave,
    })
    const destination = 'http://test.com'
    const expected = { path: '1' }
    const result = await utils.short(destination)

    expect({ path: result.path }).toEqual(expected)
    expect(shortUrlUdSave).toHaveBeenCalledTimes(1)
    expect(models.ShortUrl.create).toHaveBeenCalledTimes(1)
    expect(models.ShortUrl.create).toHaveBeenCalledWith({
      path: 'temp',
      destination,
    })
  })

  it('logGateway', async () => {
    const ip = '0.0.0.0'
    const referrer = 'localhost'
    const shortUrl = {
      addLog: jest.fn(),
    }
    const req = {
      get: jest.fn(),
      headers: [],
      connection: { remoteAddress: ip },
    }
    req.get.mockReturnValue(referrer)
    models.LogUrl.create.mockReturnValue({ path: 'test' })

    const expected = { path: 'test' }
    const result = await utils.logGateway(shortUrl, req)

    expect(result).toEqual(expected)
    expect(models.LogUrl.create).toHaveBeenCalledTimes(1)
    expect(models.LogUrl.create).toHaveBeenCalledWith({
      referrer,
      ip,
    })
  })

  it('getShortUrlByPath', async () => {
    models.ShortUrl.findOne.mockReturnValue({ path: 'test' })
    const path = 'test'
    const expected = { path: 'test' }
    const result = await utils.getShortUrlByPath(path)

    expect(result).toEqual(expected)
    expect(models.ShortUrl.findOne).toHaveBeenCalledTimes(1)
    expect(models.ShortUrl.findOne).toHaveBeenCalledWith({
      attributes: expect.any(Array),
      where: { path },
    })
  })

  it('getUrlShortStats', async () => {
    models.LogUrl.count.mockReturnValue(1)
    const path = 'test'
    const expected = { count: 1 }
    const result = await utils.getUrlShortStats(path)

    expect(result).toEqual(expected)
    expect(models.LogUrl.count).toHaveBeenCalledTimes(1)
    expect(models.LogUrl.count).toHaveBeenCalledWith({ include: expect.any(Array) })
  })

  it('getUrlShortHistory', async () => {
    models.LogUrl.findAll.mockReturnValue([{ path: 'test' }])
    const path = 'test'
    const expected = [{ path: 'test' }]
    const result = await utils.getUrlShortHistory(path)

    expect(result).toEqual(expected)
    expect(models.LogUrl.findAll).toHaveBeenCalledTimes(1)
    expect(models.LogUrl.findAll).toHaveBeenCalledWith({
      attributes: expect.any(Array),
      include: [
        {
          model: expect.any(Object),
          where: { path },
          attributes: expect.any(Array),
        },
      ],
    })
  })

  it('getLastGeneralShortUrl', async () => {
    models.ShortUrl.findAll.mockReturnValue([{
      toJSON: () => ({ path: 'test', Logs: [{ referrer: 'test' }] }),
    }])
    const expected = [{ path: 'test', clicks: 1 }]
    const result = await utils.getLastGeneralShortUrl()

    expect(result).toEqual(expected)
    expect(models.ShortUrl.findAll).toHaveBeenCalledTimes(1)
    expect(models.ShortUrl.findAll).toHaveBeenCalledWith(expect.any(Object))
  })
})
