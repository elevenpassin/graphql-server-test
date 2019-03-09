import { config } from 'dotenv'
import express from 'express'
import cors from 'cors'
import { ApolloServer } from 'apollo-server-express'

import schema from './schema'
import resolvers from './resolvers'
import models from './models'

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

app.listen({
  port: process.env.PORT
}, () => console.log(`Apollo server running at http://localhost:${process.env.PORT}`))
