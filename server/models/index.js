import makeShortUrlModel from './ShortUrl'
import makeLogUrlModel from './LogUrl'

export const makeModels = ({ db, Sequelize }) => {
  const ShortUrl = makeShortUrlModel({ db, Sequelize })
  const LogUrl = makeLogUrlModel({ db, Sequelize })
  const models = {
    Sequelize,
    ShortUrl,
    LogUrl,
  }

  ShortUrl.hasMany(LogUrl, { as: 'Logs' })
  LogUrl.belongsTo(ShortUrl)

  db.sync()
  return models
}

export default makeModels
