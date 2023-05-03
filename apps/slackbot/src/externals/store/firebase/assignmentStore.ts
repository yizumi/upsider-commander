import { Assignment } from '../../../models/assignment';
import database from './database'

export async function createAssignment(assignment: Assignment): Promise<Assignment> {
    const newAssignmentRef = database.ref(`/users/${assignment.userKey}/assignments`).push();
    await newAssignmentRef.set({ ...assignment, key: newAssignmentRef.key });
    return { ...assignment, key: newAssignmentRef.key! }; 
}

export async function deleteAssignment(userKey: string, key: string): Promise<void> {
    return await database.ref(`/users/${userKey}/assignments/${key}`).remove();
}

export async function getAssignmentsForUser(userKey: string): Promise<Assignment[]> {
    const snapshot = await database.ref(`/users/${userKey}/assignments`).once('value');
    const assignments: Assignment[] = [];
    snapshot.forEach((childSnapshot) => {
        assignments.push({ ...childSnapshot.val(), key: childSnapshot.key! });
    });
    return assignments;
}

export default {
    createAssignment,
    deleteAssignment,
    getAssignmentsForUser,
}
