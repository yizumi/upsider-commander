import { Interpretation } from '../externals/interpreter/chatgpt'
import personaStore from '../externals/store/firebase/personaStore'
import assignmentStore from '../externals/store/firebase/assignmentStore'
import userStore from '../externals/store/firebase/userStore'
import {Persona, User} from '../models'
import {Assignment} from "../models/assignment";

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

    @Interpretation(`Extract the name of persona and user from the following message:
        ---
        {message}
        ---
        Return the result in the following JSON format:
        ---
        {
            "userName": "{user name}",
            "personaName": "{persona name}"
        }
        ---
        Persona Name should be one of the following:
        ---
        {personaNames}
        ---   
        If the name can not be extracted, return an error message in the following JSON format:
        ---
        {
            "error": "{error message}"
        }
        ---
        The error message will be displayed to the user, so make sure it is user friendly using the original language.
    `, {
        personaNames: async (...args): Promise<string> => {
            const user = args[1] as User
            const personas = await personaStore.getPersonasByOrganizationKey(user.organizationKey)
            return personas.map(p => p.name).join(', ')
        }
    })
    public async assignPersona(message: string, user: User): Promise<Assignment> {
        const parsedMessage = JSON.parse(message)
        if (parsedMessage.error) {
            throw new Error(parsedMessage.error)
        }

        const persona = await personaStore.findPersonaByName(this.organizationKey, parsedMessage.personaName)

        if (!persona) {
            throw new Error(`Persona not found by name ${parsedMessage.personaName}`)
        }

        const targetUser = await userStore.findUserByName(this.organizationKey, parsedMessage.userName)

        if (!targetUser) {
            throw new Error(`User not found by name ${parsedMessage.userName}`)
        }

        const assignment = await assignmentStore.createAssignment({
            userKey: targetUser.key!,
            personaKey: persona.key!
        })

        return assignment
    }

    @Interpretation(`Extract the name of persona and user from the following message:
        ---
        {message}
        ---
        Return the result in the following JSON format:
        ---
        {
            "personaName": "{persona name}",
            "userName": "{user name}"
        }
        ---
        If the name can not be extracted, return an error message in the following JSON format:
        ---
        {
            "error": "{error message}"
        }
        ---
        The error message will be displayed to the user, so make sure it is user friendly using the original language.`, {
        personaNames: async (...args): Promise<string> => {
            const user = args[1] as User
            const personas = await personaStore.getPersonasByOrganizationKey(user.organizationKey)
            return personas.map(p => p.name).join(", ")
        }
    })
    public async unassignPersona(message: string): Promise<void> {
        const parsedMessage = JSON.parse(message)
        if (parsedMessage.error) {
            throw new Error(parsedMessage.error)
        }

        const user = await userStore.findUserByName(this.organizationKey, parsedMessage.userName)

        if (!user) {
            throw new Error(`User not found by name ${parsedMessage.userName}`)
        }

        const persona = await personaStore.findPersonaByName(this.organizationKey, parsedMessage.personaName)

        if (!persona) {
            throw new Error(`Persona not found by name ${parsedMessage.personaName}`)
        }

        await assignmentStore.deleteAssignment(user.key!, persona.key!)
    }
}
