export default {
  Query: {
    me: async (parent, args, { models, me }) => models.User.findById(me.id),
    user: async (parent, { id }, { models }) => models.User.findById(id),
    users: async (parent, args, { models }) => models.User.findAll()
  },
  Mutation: {

  },
  User: {
    messages: async (user, args, { models }) => models.User.findAll({
      where: {
        userId: user.id
      }
    })
  }
}
