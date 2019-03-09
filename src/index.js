import { config } from 'dotenv'
import express from 'express'
import cors from 'cors'
import { ApolloServer } from 'apollo-server-express'

import schema from './schema'
import resolvers from './resolvers'
import models, { sequelize } from './models'

config()
const app = express()
app.use(cors())

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    models,
    me: models.users[1]
  }
})

server.applyMiddleware({
  app,
  path: '/graphql'
})

const eraseDatabaseOnSync = true

sequelize.sync({
  force: eraseDatabaseOnSync
}).then(async () => {
  if (eraseDatabaseOnSync) {
    createUsersWithMessages()
  }
  app.listen({
    port: process.env.PORT
  }, () => console.log(`Apollo server running at http://localhost:${process.env.PORT}`))
})

const createUsersWithMessages = async () => {
  await models.User.create(
    {
      username: 'buoyantair',
      messages: [
        {
          text: 'Hello world!'
        }
      ]
    },
    {
      include: [models.Message]
    })

  await models.User.create(
    {
      username: 'Vasili',
      messages: [
        {
          text: 'Alice in the wonderland'
        },
        {
          text: 'Rorororor'
        }
      ]
    },
    {
      include: [models.Message]
    }
  )
}
