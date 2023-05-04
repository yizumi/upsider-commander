import {createUser, getAssignmentsForUser, getUserByKey} from '../externals/store/firebase'
import {Capability, User} from "../models";
import {getPersonaByKey} from "../externals/store/firebase/personaStore";

export async function login(userKey: string): Promise<User> {
    return await getUserByKey(userKey)
}

export async function getCapabilitiesForUser(user: User): Promise<Capability[]> {
    const assignments = await getAssignmentsForUser(user.key)
    const capabilities: Capability[] = []
    for (const assignment of assignments) {
        const persona = await getPersonaByKey(user.organizationKey, assignment.personaKey)
        persona?.capabilities?.forEach(capability => capabilities.push(capability))
    }
    return capabilities
}
