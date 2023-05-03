const { chatGPT } = require('../externals/interpreter/chatGPT')
const { getCapabilitiesForUser } = require('../externals/store/firebase/database')

const interpreter = chatGPT

module.exports = {
    createTasksFromMessage: async (user, message) => {
        const capabilities = getCapabilitiesForUser(user)
        const response = chatGPT.interpret(`
            Which of the following actions relate to the sentence of "${message}"?
            ---
            CreateMeetingInvite, SendEmail, UpdateMeetingInvite, DeleteMeetingInvite, ListMeetingInvites, CreateNewEmployee, ProcureDevices, SendDevicesRepair, ProvisionAppAccounts, ResignEmployee, ListEmployees, FindEmployee.
            ---
            Return the response in the following JSON format such that it extracts the action name and the description of the action, for example:
            ===
            {
                "status": "ok",
                "tasks": [{
                    "action_name": "CreateMeetingInvite",
                    "description": "Create a 30 minute meeting invite called 'Brithday Celebration' on May 15th at 3pm with attendees of @Yusuke @Ema @Shota"
                }, {
                    "action_name": "SendMessage",
                    "description": "Send message saying you are invited to Birthday Celbration to @Yusuke @Ema, @Shota"
                }]
            }
            ===
            If no matches found, just say
            ===
            {
                "status": "no_match_found"
            }
            ===
        `)
        const result = JOSN.parse(response)
        if (result.status === 'no_match_found') {
            throw new Error('No matches found')
        }
        return result.tasks
    },
}