import { App } from '../../../models'
import database from './database'

export async function createApp(app: App): Promise<App> {
    const ref = await database.ref(`/organizations/${app.organizationKey}/apps`).push(app)
    await database.ref(`/organizations/${app.organizationKey}/apps/${ref.key}`).set({ ...app, key: ref.key })
    return (await database.ref(`/organizations/${app.organizationKey}/apps/${ref.key}`).once('value')).val()
}

export async function getAppByKey(organizationKey: string, appKey?: string): Promise<App> {
    if (!appKey) {
        throw new Error('appKey is required')
    }
    return (await database.ref(`/organizations/${organizationKey}/apps/${appKey}`).once('value')).val()
}

export async function getAppsByOrganizationKey(organizationKey: string): Promise<App[]> {
    return (await database.ref(`/organizations/${organizationKey}/apps`).once('value')).val()
}

export async function updateApp(app: App): Promise<App> {
    if (!app.key) {
        throw new Error('appKey is required')
    }
    await database.ref(`/organizations/${app.organizationKey}/apps/${app.key}`).set(app)
    return (await database.ref(`/organizations/${app.organizationKey}/apps/${app.key}`).once('value')).val()
}

export async function deleteApp(organizationKey: string, appKey?: string): Promise<null> {
    if (!appKey) {
        throw new Error('appKey is required')
    }
    await database.ref(`/organizations/${organizationKey}/apps/${appKey}`).set(null)
    return (await database.ref(`/organizations/${organizationKey}/apps/${appKey}`).once('value')).val()
}

export default {
    createApp,
    getAppByKey,
    getAppsByOrganizationKey,
    updateApp,
    deleteApp,
}
