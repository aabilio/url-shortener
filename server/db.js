const makeDatabase = ({ Sequelize, log }) => {
  const dtbs = (host = 'localhost', type = 'mysql', database = null, user = null, passwd = null) => {
    if (!database || !user || !passwd) {
      return new Error('Bad database configuration')
    }

    const db = new Sequelize(database, user, passwd, {
      host,
      dialect: type,
      operatorsAliases: false,
    })

    db.authenticate()
      .then(() => {
        log('Connection has been established successfully.')
      })
      .catch((err) => {
        log('Connection error: ', err)
      })

    return db
  }
  return dtbs
}

export default makeDatabase
