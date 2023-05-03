import { createUser } from '../externals/store/firebase'
import { deleteOrganization } from '../externals/store/firebase/organizationStore'
import personaStore from '../externals/store/firebase/personaStore'
import { Persona } from '../models'
import UpsiderCommander from './UpsiderCommander'

describe('UpsiderCommander', () => {
    const commander = new UpsiderCommander('org1')

    afterEach(async () => {
        await deleteOrganization('org1')
    })

    it('should be able to create Persona from sentence', async () => {
        await commander.createPersona("Create an persona named 'IT Admin' with the following capabilities: CreatePersona, UpdatePersona, DeletePersona for app 'Upsider Commander'")
        const persona = await personaStore.findPersonaByName('org1', 'IT Admin')
        expect(persona).not.toBeNull()
    }, 10000)

    it('should be able to Delete Persona by Name', async () => {
        await commander.createPersona("Create an persona named 'IT Admin' with the following capabilities: CreatePersona, UpdatePersona, DeletePersona for app 'Upsider Commander'")
        await commander.deletePersona("IT Adminというペルソナを削除してください")
        const persona = await personaStore.findPersonaByName('org1', 'IT Admin')
        expect(persona).toBeNull()
    }, 20000)

    it('should be able to assign a persona to a user', async () => {
        const persona = await personaStore.createPersona({
            key: 'persona1',
            name: 'IT Admin',
            organizationKey: 'org1',
            capabilities: [{
                appName: 'BambooHR',
                commandName: 'CreateNewEmployee',
            }],
        })

        const user = await createUser('U1234567890', {
            key: 'U1234567890',
            name: 'John Smith',
            email: 'john.smith@example.com',
            organizationKey: 'org1',
        })

        const assignment = await commander.assignPersona("Assign persona IT Admin to John Smith", user)

        expect(assignment).not.toBeNull()
    }, 10000)
})
