import Sequelize from 'sequelize'

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    dialect: 'postgres'
  }
)

const models = {
  User: sequelize.import('./user'),
  Message: sequelize.import('./message')
}

for (let key of Object.keys(models)) {
  if ('associate' in models[key]) {
    models[key].associate(models)
  }
}

export { sequelize }

export default models
