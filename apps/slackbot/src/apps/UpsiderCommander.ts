import { Interpretation } from '../externals/interpreter/chatgpt';
import personaStore from '../externals/store/firebase/personaStore';
import { Persona } from '../models'

export default class UpsiderCommander {
    organizationKey: string

    constructor(organizationKey: string) {
        this.organizationKey = organizationKey
    }

    @Interpretation(`Extract the name of the persona and capabilities from the following message:
        ---
        {message}
        ---
        Return the result in the following JSON format:
        ---
        {
            "name": "{persona name}",
            "capabilities": [
                {
                    "appName": "{app name}",
                    "commandName": "{capability name}"
                }
            ]
        }
        ---
        Note that the app and command names of capabilities must map to one of the following:
        ---
        App: UpsiderCommander
            Commands: CreateOrganization, UpdateOrganization, DeleteOrganization, ListOrganizations, CreatePersona, UpdatePersona, DeletePersona, ListPersonas
        App: Slack
            Commands: CreateChannel, UpdateChannel, DeleteChannel
        ---
        If not all required fields are present, or there is an ambiguity in the App and Command name, return an error message in the following JSON format:
        ---
        {
            "error": "{error message}"
        }
        ---
        The error message will be displayed to the user, so make sure it is user friendly using the original language.`)
    public async createPersona(message: string): Promise<Persona> {
        const persona = JSON.parse(message)

        if (persona.error) {
            throw new Error(persona.error)
        }

        const createdPersona = await personaStore.createPersona({
            ...persona,
            organizationKey: this.organizationKey
        } as Persona)

        return createdPersona
    }

    @Interpretation(`Extract the name of persona from the following message:
        ---
        {message}
        ---
        Return the result in the following JSON format:
        ---
        {
            "name": "{persona name}"
        }
        ---
        If the name can not be extracted, return an error message in the following JSON format:
        ---
        {
            "error": "{error message}"
        }
        ---
        The error message will be displayed to the user, so make sure it is user friendly using the original language.`)
    public async deletePersona(message: string): Promise<void> {
        const parsedMessage = JSON.parse(message)
        if (parsedMessage.error) {
            throw new Error(parsedMessage.error)
        }
        
        const persona = await personaStore.findPersonaByName(this.organizationKey, parsedMessage.name)

        if (!persona) {
            throw new Error(`Persona not found by name ${parsedMessage.name}`)
        }

        await personaStore.deletePersona(persona.organizationKey, persona.key!)
    }
}