
export default {
  Query: {
    message: async (parent, { id }, { models }) => models.Message.findById(id),
    messages: async (parent, args, { models }) => models.Message.findAll()
  },
  Mutation: {
    createMessage: async (parent, { text }, { me, models }) => models.Message.create({
      text,
      userId: me.id
    }),
    deleteMessage: async (parent, { id }, { models }) => models.Message.destroy({
      where: {
        id
      }
    }),
    updateMessage: async (parent, { id, text }, { models }) => models.Message.update({
      where: {
        id
      },
      fields: {
        text
      }
    })
  },
  Message: {
    user: async ({ userId }, args, { models }) => models.User.findById(userId)
  }
}
