import { config } from 'dotenv'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'

config()
const app = express()
const schema = null
const resolvers = null

const server = new ApolloServer({
  typeDefs: schema,
  resolvers
})

server.applyMiddleware({
  app,
  path: '/graphql'
})

app.listen({
  port: process.env.PORT
}, () => console.log(`Apollo server running at http://localhost:${process.env.PORT}`))
