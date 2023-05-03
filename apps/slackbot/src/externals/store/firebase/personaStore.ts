import { Persona } from '../../../models';
import database from './database'

export async function createPersona(persona: Persona): Promise<Persona> {
    if (!persona.organizationKey) {
        throw new Error('organizationKey is required')
    }
    const ref = await database.ref(`/organizations/${persona.organizationKey}/personas`).push(persona)
    return { ...persona, key: ref.key! }
}

export async function updatePersona(persona: Persona): Promise<Persona> {
    if (!persona.organizationKey) {
        throw new Error('organizationKey is required')
    }
    if (!persona.key) {
        throw new Error('key is required')
    }
    await database.ref(`/organizations/${persona.organizationKey}/personas/${persona.key}`).set(persona)
    return persona
}

export async function getPersonaByKey(organizationKey: string, key: string): Promise<Persona | null> {
    const snapshot = await database.ref(`/organizations/${organizationKey}/personas/${key}`).once('value')
    return snapshot.val()
}

export async function deletePersona(organizationKey: string, key?: string): Promise<void> {
    if (!key) {
        throw new Error('key is required')
    }
    await database.ref(`/organizations/${organizationKey}/personas/${key}`).remove()
}

export async function findPersonaByName(organizationKey: string, name: string): Promise<Persona | null> {
    const snapshot = await database.ref(`/organizations/${organizationKey}/personas`).orderByChild('name').equalTo(name).once('value')
    const values = snapshot.val()
    if (!values) {
        return null
    }
    const key = Object.keys(values)[0]
    return { ...values[key], key }
}

export default {
    createPersona,
    updatePersona,
    getPersonaByKey,
    deletePersona,
    findPersonaByName,
}
