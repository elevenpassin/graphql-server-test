import { config } from 'dotenv'
import express from 'express'
import cors from 'cors'
import { ApolloServer, gql } from 'apollo-server-express'

config()
const app = express()
app.use(cors())
const schema = gql`
  type Query {
    me: User
    user(id: ID!): User
    users: [User!]
  }

  type User {
    id: ID!
    username: String!
  }
`

let users = {
  1: {
    id: '1',
    username: 'buoyantair'
  },
  2: {
    id: '2',
    username: 'Vasili Záitsev'
  }
}

const resolvers = {
  Query: {
    me: (parent, args, { me }) => me,
    user: (parent, { id }) => users[id],
    users: () => Object.values(users)
  },
  User: {
    username: user => user.username
  }
}

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    me: users[1]
  }
})

server.applyMiddleware({
  app,
  path: '/graphql'
})

app.listen({
  port: process.env.PORT
}, () => console.log(`Apollo server running at http://localhost:${process.env.PORT}`))
