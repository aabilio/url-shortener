
export const isString = x => Object.prototype.toString.call(x) === '[object String]'

export const makeValidateDestinationController = ({ utils }) => (req, res) => {
  const { url } = req.query
  if (!isString(url)) {
    return res.status(400).json({ error: 'destination not valid' })
  }

  const valid = utils.validateDestination(url)
  return res.json({ valid })
}

export const makeShortController = ({ utils }) => async (req, res) => {
  const { url } = req.body
  if (!isString(url)) {
    return res.status(400).json({ error: 'destination not valid' })
  }

  const valid = utils.validateDestination(url)
  if (!valid) {
    return res.status(400).json({ error: 'destination not valid' })
  }

  const shortUrl = await utils.short(url)
  return res.json(shortUrl)
}

export const makeGatewayController = ({ utils }) => async (req, res, next) => {
  const { path } = req.params
  const shortUrl = await utils.getShortUrlByPath(path)
  if (!shortUrl || !shortUrl.active) {
    return next()
  }

  utils.logGateway(shortUrl, req)
  return res.redirect(shortUrl.destination)
}

export const makeInfoController = ({ utils }) => async (req, res) => {
  const { path } = req.params
  if (!path) {
    return res.status(400).json({ error: 'bad path' })
  }

  const info = await utils.getShortUrlByPath(path)
  return res.json(info)
}

export const makeStatsController = ({ utils }) => async (req, res) => {
  const { path } = req.params
  if (!path) {
    return res.status(400).json({ error: 'bad path' })
  }

  const stats = await await utils.getUrlShortStats(path)
  return res.json(stats)
}

export const makeHistoryController = ({ utils }) => async (req, res) => {
  const { path } = req.params
  if (!path) {
    return res.status(400).json({ error: 'bad path' })
  }
  // TODO: pagination
  const history = await utils.getUrlShortHistory(path)
  return res.json(history)
}

export const makeLastShortUrlsController = ({ utils }) => async (req, res) => {
  const shortUrls = await utils.getLastGeneralShortUrl()
  return res.json(shortUrls)
}

const makeControllers = ({ utils }) => ({
  validateDestinationController: makeValidateDestinationController({ utils }),
  shortController: makeShortController({ utils }),
  gatewayController: makeGatewayController({ utils }),
  statsController: makeStatsController({ utils }),
  historyController: makeHistoryController({ utils }),
  infoController: makeInfoController({ utils }),
  lastShortUrlsController: makeLastShortUrlsController({ utils }),
})

export default makeControllers
