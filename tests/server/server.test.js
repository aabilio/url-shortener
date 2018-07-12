import makeServer from '../../server/server'

describe('Sever', () => {
  const PORT = 3000

  let log
  let express
  let bodyParser
  let handle
  let controllers

  let server

  beforeEach(() => {
    controllers = {
      validateDestinationController: jest.fn(),
      shortController: jest.fn(),
      infoController: jest.fn(),
      statsController: jest.fn(),
      historyController: jest.fn(),
      lastShortUrlsController: jest.fn(),
      gatewayController: jest.fn(),
    }
    express = jest.fn()
    express.use = jest.fn()
    express.get = jest.fn()
    express.post = jest.fn()
    express.listen = jest.fn()
    express.mockReturnValue({
      use: express.use,
      get: express.get,
      post: express.post,
      listen: express.listen,
    })
    bodyParser = {
      json: jest.fn(),
    }
    handle = jest.fn()
    log = jest.fn()

    server = makeServer({
      log, express, bodyParser, controllers, handle,
    })
  })

  it('Just works', () => {
    server(PORT)
    expect(express).toHaveBeenCalledTimes(1)
    expect(express.use).toHaveBeenCalled()
    expect(express.get).toHaveBeenCalled()
    expect(express.post).toHaveBeenCalled()
    expect(express.listen).toHaveBeenCalledTimes(1)
    expect(express.listen).toHaveBeenCalledWith(PORT, expect.any(Function))
    expect(bodyParser.json).toHaveBeenCalledTimes(1)
    expect(bodyParser.json).toHaveBeenCalledTimes(1)
  })
})
