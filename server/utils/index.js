export const validateDestination = (url = null) => {
  // Basic: RegExp
  /* eslint-disable no-useless-escape */
  const re = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#()?&//=]*)/
  return re.test(url)
}

export const makeShort = ({ models }) => async (destination) => {
  if (!validateDestination(destination)) {
    return new Error('Invalid destination')
  }
  // Basic Path implementation: same as model id
  const data = {
    path: 'temp',
    destination,
  }
  const shortUrl = await models.ShortUrl.create(data)
  shortUrl.path = shortUrl.id.toString()
  await shortUrl.save()
  return shortUrl
}

export const makeLogGateway = ({ models }) => async (shortUrl, req) => {
  const referrer = req.get('Referrer')
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  const log = await models.LogUrl.create({ referrer, ip })
  shortUrl.addLog(log)
  return log
}

export const makeGetShortUrlByPath = ({ models }) => async (path) => {
  const shortUrl = await models.ShortUrl.findOne({
    attributes: ['id', 'path', 'destination', 'active',
      ['createdAt', 'created_at'], ['updatedAt', 'updated_at']],
    where: { path },
  })
  return shortUrl
}

export const makeGetUrlShortStats = ({ models }) => async (path) => {
  const count = await models.LogUrl.count({
    include: [
      { model: models.ShortUrl, where: { path } },
    ],
  })
  // Basic stats: just count
  return {
    count,
  }
}

export const makeGetUrlShortHistory = ({ models }) => async (path) => {
  // TODO: Pagination
  const history = await models.LogUrl.findAll({
    attributes: ['id', 'referrer', 'ip', ['createdAt', 'visited_at']],
    include: [
      {
        model: models.ShortUrl,
        where: { path },
        attributes: [],
      },
    ],
  })
  return history
}

export const makeGetLastGeneralShortUrl = ({ models }) => async () => {
  // Get Raw data
  const shortUrlsData = await models.ShortUrl.findAll({
    attributes: ['id', 'path', 'destination', 'active',
      ['createdAt', 'created_at'], ['updatedAt', 'updated_at']],
    order: [['id', 'DESC']],
    limit: 20,
    include: [
      {
        association: 'Logs',
        attributes: ['id'],
      },
    ],
  })
  // Proccess data to count logs as clicks
  const shortUrls = shortUrlsData.map((shortUrl) => {
    const shortUrlJson = shortUrl.toJSON()
    return Object.assign({}, shortUrlJson,
      { clicks: shortUrlJson.Logs.length }, { Logs: undefined })
  })

  return shortUrls
}

const makeUtils = ({ models }) => ({
  validateDestination,
  short: makeShort({ models }),
  logGateway: makeLogGateway({ models }),
  getShortUrlByPath: makeGetShortUrlByPath({ models }),
  getUrlShortStats: makeGetUrlShortStats({ models }),
  getUrlShortHistory: makeGetUrlShortHistory({ models }),
  getLastGeneralShortUrl: makeGetLastGeneralShortUrl({ models }),
})

export default makeUtils
