import { App, Organization } from "../../../models"
import { createApp, deleteApp, updateApp } from "./appStore"
import { deleteOrganization } from "./organizationStore"

describe('appStore', () => {
    const organization: Organization = { key: 'org1', name: 'Organization 1' }

    afterAll(async () => {
        await deleteOrganization(organization.key)
    })
    
    it('should create new app', async () => {
        const newApp: App = {
            name: 'App 1',
            organizationKey: organization.key,
            capabilities: [
                {
                    name: 'CreateApp',
                    description: 'Create a new app',
                    extractionInstruction: `
                        Extract the app name and capabilities from the following sentence: 
                        ---
                        "{message}"
                        ---
                        Return the following JSON:
                        ---
                        {
                            "name": "{app name}",
                            "capabilities": [
                                { "name": "{capability name}", "description": "{capability description}" }
                            ]
                        }
                    `
                },
            ]
        }
        const createdApp = await createApp(newApp)
        expect(createdApp).toMatchObject(newApp)
        expect(createdApp.key).not.toBeNull()
    })

    it('should update app', async () => {
        const newApp: App = {
            name: 'App 1',
            organizationKey: organization.key,
            capabilities: [
                {
                    name: 'CreateApp',
                    description: 'Create a new app',
                    extractionInstruction: `
                        Extract the app name and capabilities from the following sentence: 
                        ---
                        "{message}"
                        ---
                        Return the following JSON:
                        ---
                        {
                            "name": "{app name}",
                            "capabilities": [
                                { "name": "{capability name}", "description": "{capability description}" }
                            ]
                        }
                    `
                },
            ]
        }
        const createdApp = await createApp(newApp)
        const updatedApp = await updateApp({ ...createdApp, name: 'App 2' })
        expect(updatedApp).toMatchObject({ ...createdApp, name: 'App 2' })
    })

    it('should delete app', async () => {
        const newApp: App = {
            name: 'App 1',
            organizationKey: organization.key,
            capabilities: [
                {
                    name: 'CreateApp',
                    description: 'Create a new app',
                    extractionInstruction: `
                        Extract the app name and capabilities from the following sentence: 
                        ---
                        "{message}"
                        ---
                        Return the following JSON:
                        ---
                        {
                            "name": "{app name}",
                            "capabilities": [
                                { "name": "{capability name}", "description": "{capability description}" }
                            ]
                        }
                    `
                },
            ]
        }
        const createdApp = await createApp(newApp)
        const deletedApp = await deleteApp(createdApp.organizationKey, createdApp.key)
        expect(deletedApp).toBeNull()
    })
})