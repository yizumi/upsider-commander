import TaskService from "./taskService";
import {Organization, Persona} from "../models";
import {createAssignment, createOrganization, createUser, deleteOrganization} from "../externals/store/firebase";
import {createPersona} from "../externals/store/firebase/personaStore";

describe("TaskService", () => {
    let organization: Organization
    let taskService: TaskService
    let persona: Persona

    beforeAll(async () => {
        organization = await createOrganization({ key: "org1", name: "Org 1" })
        taskService = new TaskService(organization.key)
        persona = await createPersona({
            name: 'IT Admin',
            organizationKey: organization.key,
            capabilities: [
                { appName: 'Slack', commandName: 'createChannel' },
                { appName: 'Slack', commandName: 'inviteUserToChannel' },
            ]
        })
    }, 10000)

    afterAll(async () => {
        await deleteOrganization(organization.key)

    })

    describe('given that user1 has the slack persona disabled', () => {
        it('should return no tasks', async () => {
            const user = await createUser({ email: "user1@example.com", key: "user1", name: "User 1", organizationKey: organization.key })
            const message = "Send a message saying that i'll be late for the meeting and shoot out link for the meeting."
            try {
                await taskService.createTasksFromMessage(message, user)
                fail("Expected error")
            } catch {
                // Expected
            }
        }, 10000)
    })

    describe('given that user1 has the slack persona enabled', () => {
        it('should return tasks for creating channel and inviting user', async () => {
            const user = await createUser({ email: "user2@example.com", key: "user2", name: "User 2", organizationKey: organization.key })
            await createAssignment({ personaKey: persona.key!, userKey: user.key })

            const message = "Create a Slack channel called #general and invite @john and @jane to it. Then eat a banana in the fridge."
            const tasks = await taskService.createTasksFromMessage(message, user)

            expect(tasks.length).toEqual(2)
            expect(tasks[0].capability.appName).toEqual("Slack")
            expect(tasks[0].capability.commandName).toEqual("createChannel")
            expect(tasks[1].capability.appName).toEqual("Slack")
            expect(tasks[1].capability.commandName).toEqual("inviteUserToChannel")
        }, 20000)
    })
})
