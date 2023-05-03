const { createUser, getUserByKey } = require('../externals/store/firebaseDatabase')

module.exports = {
    login: async (key) => {
        const user = await getUserByKey(key)
        if (!user) {
            await createUser(event.user, { id: event.user })
        }
        return user
    },
}