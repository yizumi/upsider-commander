import interpreter, {Interpretation} from '../externals/interpreter/chatgpt'
import { getCapabilitiesForUser } from '../externals/store/firebase'
import {User} from "../models";

class TaskService {
    private organizationKey: string
    private userKey: string

    constructor(organizationKey: string, userKey: string) {
        this.organizationKey = organizationKey
        this.userKey = userKey
    }

    @Interpretation(`
        Given the following message, create the list of tasks:
        ---
        {message}
        ---
        For instance, if you see a message like this:
        ---
        "Create a Slack channel called #general and invite @john and @jane to it"
        ---
        Return the response as JSON in the following format:
        ---
        {
            tasks: [
                {
                    title: "Create a slack channel called #general",
                    appName: "Slack",
                    commandName: "CreateChannel",
                    details: "Create a slack channel called #general",
                },
                {
                    title: "Invite members into the channel",
                    appName: "Slack", 
                    commandName: "InviteMembers",
                    details: "Invite @john and @jane to the channel
                }
            ]
        }
        ---
        The appName and commandName are used to identify the command to be executed.
        These should be the same as the ones used in the command registry.
        Here's the list of commands that are currently supported:
        ---
        Slack: InviteMembers
        UpsiderCommander: createPersona, deletePersona, assignPersonaToUser, unassignPersonaFromUser
    `, {
        personaNames: async (...args): Promise<string> => {
            const user = args[1] as User
            const personas = await personaStore.getPersonasByOrganizationKey(user.organizationKey)
            return personas.map(p => p.name).join(", ")
        }
    })
    public async createTasksFromMessage(message: string) {
        const capabilities = getCapabilitiesForUser(this.userKey)

        const response = interpreter.interpret(`
        `)
        const result = JOSN.parse(response)
        if (result.status === 'no_match_found') {
            throw new Error('No matches found')
        }
        return result.tasks
    }
}
module.exports = {
    createTasksFromMessage: async (user, message) => {
        const capabilities = getCapabilitiesForUser(user)

        const response = interpreter.interpret(`
        `)
        const result = JOSN.parse(response)
        if (result.status === 'no_match_found') {
            throw new Error('No matches found')
        }
        return result.tasks
    },
}
