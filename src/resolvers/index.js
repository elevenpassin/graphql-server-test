import uuid4 from 'uuid/v4'

const resolvers = {
  Query: {
    me: (parent, args, { me }) => me,
    user: (parent, { id }, { models }) => models.users[id],
    users: (parent, args, { models }) => Object.values(models.users),
    message: (parent, { id }, { models }) => models.messages[id],
    messages: (parent, args, { models }) => Object.values(models.messages)
  },
  Mutation: {
    createMessage: (parent, { text }, { me, models }) => {
      const id = uuid4()
      const message = {
        text,
        userId: me.id,
        id
      }
      models.messages[id] = message
      models.users[me.id].messageIds.push(id)
      return message
    },
    deleteMessage: (parent, { id }, { models }) => {
      const { [id]: message, ...otherMessages } = models.messages

      if (!message) {
        return false
      }

      models.messages = otherMessages
      return true
    },
    updateMessage: (parent, { id, text }, { models }) => {
      const { [id]: message, ...otherMessages } = models.messages
      if (!message) {
        return null
      }

      message.text = text
      models.messages = {
        [id]: message,
        ...otherMessages
      }

      return message
    }
  },
  Message: {
    user: ({ userId }, args, { models }) => models.users[userId]
  },
  User: {
    messages: (user, args, { models }) => Object.values(models.messages).filter(m => m.userId === user.id)
  }
}

export default resolvers
