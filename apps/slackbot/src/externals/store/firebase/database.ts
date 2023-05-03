import admin from 'firebase-admin'

const serviceAccount: admin.ServiceAccount = require('../../../../serviceAccount.json')

const firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://upsider-commander-default-rtdb.firebaseio.com',
})

const database = firebaseApp.database()
export default database
