import { config } from 'dotenv'
import express from 'express'
import cors from 'cors'
import { ApolloServer, gql } from 'apollo-server-express'
import uuid4 from 'uuid/v4'

config()
const app = express()
app.use(cors())
const schema = gql`
  type Query {
    me: User
    user(id: ID!): User
    users: [User!]
    messages: [Message!]!
    message(id: ID!): Message!
  }

  type Mutation {
    createMessage(text: String!): Message!
  }

  type User {
    id: ID!
    username: String!
    messages: [Message!]!
  }

  type Message {
    id: ID!
    text: String!
    user: User!
  }
`

let users = {
  1: {
    id: '1',
    username: 'buoyantair',
    messageIds: [1]
  },
  2: {
    id: '2',
    username: 'Vasili Záitsev',
    messageIds: [2]
  }
}

let messages = {
  1: {
    id: '1',
    text: 'Hello World',
    userId: '1'
  },
  2: {
    id: '2',
    text: 'By World',
    userId: '2'
  }
}

const resolvers = {
  Query: {
    me: (parent, args, { me }) => me,
    user: (parent, { id }) => users[id],
    users: () => Object.values(users),
    message: (parent, { id }) => messages[id],
    messages: () => Object.values(messages)
  },
  Mutation: {
    createMessage: (parent, { text }, { me }) => {
      const id = uuid4()
      const message = {
        text,
        userId: me.id,
        id
      }
      messages[id] = message
      users[me.id].messageIds.push(id)
      return message
    }
  },
  Message: {
    user: ({ userId }, args) => users[userId]
  },
  User: {
    messages: user => Object.values(messages).filter(m => m.userId === user.id)
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
