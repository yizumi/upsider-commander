const admin = require('firebase-admin');

const firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(admin.credential.cert(require('../serviceAccount.json'))),
    databaseURL: 'https://upsider-commander-default-rtdb.firebaseio.com',
})

const database = firebaseApp.database()

module.exports = {
    getUserByKey: async (key) => {
        return (await database.ref(`/users/${key}`).once('value')).val()
    },

    createUser: async (key, user) => {
        await database.ref(`users/${key}`).set(user)
        return (await database.ref(`/users/${key}`).once('value')).val()
    },

    updateUser: async (key, data) => {
        await database.ref(`/users/${key}`).set(data)
        return (await database.ref(`/users/${key}`).once('value')).val()
    },

    deleteUser: async (key) => { 
        await database.ref(`/users/${key}`).set(null)
        return (await database.ref(`/users/${key}`).once('value')).val()
    }
}