import { Persona } from "../../../models"
import { createPersona, deletePersona, findPersonaByName } from "./personaStore"

describe('personaStore', () => {
    it('should be able to create a persona', async () => {
        const newPersona: Persona = {
            name: 'IT Admin',
            organizationKey: 'org1',
            capabilities: [
                { appName: 'UpsiderCommander', commandName: 'CreatePersona' },
                { appName: 'UpsiderCommander', commandName: 'UpdatePersona' },
                { appName: 'UpsiderCommander', commandName: 'DeletePersona' },
            ]
        }
        const createdPersona = await createPersona(newPersona)
    })

    it('should be able to find a persona by name', async () => {
        const persona = await findPersonaByName('org1', 'IT Admin')
        expect(persona).not.toBeNull()
    })

    it('should be able to delete a persona', async () => {
        const persona = await findPersonaByName('org1', 'IT Admin')
        if (!persona) {
            throw Error('persona not found')
        }
        await deletePersona('org1', persona!.key)
        const deletedPersona = await findPersonaByName('org1', 'IT Admin')
        expect(deletedPersona).toBeNull()
    })
})