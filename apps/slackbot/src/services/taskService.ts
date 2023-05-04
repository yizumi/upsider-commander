import { Interpretation } from '../externals/interpreter/chatgpt'
import {Capability, Task, User} from "../models";
import {getCapabilitiesForUser} from "./userService";

export default class TaskService {
    private organizationKey: string

    constructor(organizationKey: string) {
        this.organizationKey = organizationKey
    }

    @Interpretation(`
        Given the following message, create the list of tasks:
        ---
        {message}
        ---
        The result is expected to be in this format:
        ---
        {
            "tasks": [
                {
                    "title": "{summary of the task}",
                    "details": "{details of the task}",
                    "capability": {
                        "appName": "{name of the app that handles the task}",
                        "commandName": "{name of the command that handles the task}"
                    }
                },
                {
                    ...
                }
            ]
        }
        ---
        
        For example, if you see a message "Buy a Book titled '3 minute cooking' and photo copy pages 38-41",
        then return the response as JSON in the following format:
        ---
        {
            "tasks": [
                {
                    "title": "Buy a Book",
                    "details": "Buy a book titled '3 minute cooking'",
                    "capability": {
                        "appName": "Amazon",
                        "commandName": "BuyBook"
                    }
                },
                {
                    "title": "Photocopy the book",
                    "details": "Photocopy pages 38-41",
                    "capability": {
                        "appName": "BookScan.com",
                        "commandName": "Photocopy the Book"
                    }
                }
            ]
        }
        ---
     
        The appName and commandName may not be generated on your own. 
        The capability must be selected based on the following list of supported capabilities in JSON format:
        ---
        {capabilities}
        ---
        
        If the supported capability is empty or capability cannot be found in the list of supported capabilities, then simply return the following error:
        ---
        {
            "error": "{error message}"
        }
        ---
        The error message will be displayed to the user, so make sure it's user friendly in the original message's language.
    `, {
        capabilities: async (...args): Promise<string> => {
            const user = args[1] as User
            const capabilities = await getCapabilitiesForUser(user)
            return JSON.stringify(capabilities)
        }
    })
    private async interpretTasksFromMessage(message: string, capabilities: Capability[]): Promise<Task[]> {
        const parsedMessage = JSON.parse(message)
        if (parsedMessage.error) {
            throw new Error(parsedMessage.error)
        }
        return parsedMessage.tasks
    }

    public async createTasksFromMessage(message: string, user: User): Promise<Task[]> {
        const capabilities = await getCapabilitiesForUser(user)
        const interpretedTasks = await this.interpretTasksFromMessage(message, capabilities)

        // Double check that tasks' capabilities are enabled for the user
        const capabilityNames = capabilities.map(capability => capability.appName + ":" + capability.commandName)
        const filteredTasks = interpretedTasks.filter(task => capabilityNames.includes(task.capability.appName + ":" + task.capability.commandName))

        if (filteredTasks.length === 0) {
            throw new Error(`No tasks can be created for the user`)
        }

        return filteredTasks
    }
}
