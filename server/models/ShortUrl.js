const makeShortUrlModel = ({ db, Sequelize }) => db.define('short-url', {
  id: {
    type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true,
  },
  path: {
    type: Sequelize.STRING, allowNull: false,
  },
  destination: {
    type: Sequelize.STRING, allowNull: false,
  },
  active: {
    type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true,
  },
})

export default makeShortUrlModel
