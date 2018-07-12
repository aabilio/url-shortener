const makeLogUrlModel = ({ db, Sequelize }) => db.define('log-url', {
  id: {
    type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true,
  },
  referrer: {
    type: Sequelize.STRING, allowNull: true,
  },
  ip: {
    type: Sequelize.STRING, allowNull: true,
  },
})

export default makeLogUrlModel
