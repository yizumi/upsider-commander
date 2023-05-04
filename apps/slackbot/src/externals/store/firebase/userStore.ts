import database from './database'
import { User, Persona } from '../../../models'

export async function getUserByKey(key: string): Promise<User> {
    return (await database.ref(`/users/${key}`).once('value')).val()
}

export async function createUser(user: User): Promise<User> {
    if (!user.key) {
        throw Error('User must have a key')
    }
    await database.ref(`users/${user.key}`).set(user)
    return (await database.ref(`/users/${user.key}`).once('value')).val()
}

export async function updateUser(key: string, user: User): Promise<User> {
    if (!user.key) {
        throw Error('User must have a key')
    }
    await database.ref(`/users/${key}`).set(user)
    return (await database.ref(`/users/${key}`).once('value')).val()
}

export async function deleteUser(key: string): Promise<null> {
    await database.ref(`/users/${key}`).set(null)
    return (await database.ref(`/users/${key}`).once('value')).val()
}

export async function findUserByName(organizationKey: string, name: string): Promise<User | null> {
    // Not really scalable, but it's a small dataset for now
    const snapshot = await database.ref(`/users`).orderByChild('organizationKey').equalTo(organizationKey).once('value')
    let user: User | null = null
    snapshot.forEach((childSnapshot) => {
        const child = childSnapshot.val()
        if (child.organizationKey === organizationKey && child.name === name) {
            user = child
        }
    })
    return user
}

export default {
    getUserByKey,
    createUser,
    updateUser,
    deleteUser,
    findUserByName,
}
