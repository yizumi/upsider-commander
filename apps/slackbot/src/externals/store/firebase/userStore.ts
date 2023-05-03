import database from './database'
import { User, Persona } from '../../../models'

export async function getUserByKey(key: string): Promise<User> {
    return (await database.ref(`/users/${key}`).once('value')).val()
}

export async function createUser(key: string, user: User): Promise<User> {
    await database.ref(`users/${key}`).set(user)
    return (await database.ref(`/users/${key}`).once('value')).val()
}

export async function updateUser(key: string, user: User): Promise<User> {
    await database.ref(`/users/${key}`).set(user)
    return (await database.ref(`/users/${key}`).once('value')).val()
}

export async function deleteUser(key: string): Promise<null> { 
    await database.ref(`/users/${key}`).set(null)
    return (await database.ref(`/users/${key}`).once('value')).val()
}
