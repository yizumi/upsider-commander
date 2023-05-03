import { deleteOrganization } from '../externals/store/firebase/organizationStore'
import personaStore from '../externals/store/firebase/personaStore'
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
})