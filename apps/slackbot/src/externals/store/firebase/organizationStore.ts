import { Organization } from "../../../models"
import database from './database'

export async function deleteOrganization(key: string): Promise<null> {
    await database.ref(`/organizations/${key}`).set(null)
    return (await database.ref(`/organizations/${key}`).once('value')).val()
}

export async function createOrganization(organization: Organization): Promise<Organization> {
    const newOrganizationRef = database.ref('/organizations').push()
    await newOrganizationRef.set(organization)
    return (await newOrganizationRef.once('value')).val()
}

export async function getOrganizationByKey(key: string): Promise<Organization> {
    return (await database.ref(`/organizations/${key}`).once('value')).val()
}