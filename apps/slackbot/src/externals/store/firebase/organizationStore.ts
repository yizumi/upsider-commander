import { Organization } from "../../../models"
import database from './database'

export async function deleteOrganization(key: string): Promise<null> {
    await database.ref(`/organizations/${key}`).set(null)
    return (await database.ref(`/organizations/${key}`).once('value')).val()
}

export async function createOrganization(organization: Organization): Promise<Organization> {
    if (!organization.key) {
        throw new Error('Organization key is required')
    }
    await database.ref(`/organizations/${organization.key}`).set(organization)
    return (await database.ref(`/organizations/${organization.key}`).once('value')).val()
}

export async function getOrganizationByKey(key: string): Promise<Organization> {
    return (await database.ref(`/organizations/${key}`).once('value')).val()
}
