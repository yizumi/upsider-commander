import { User } from '../../../models';
import { createUser, updateUser, deleteUser, getUserByKey } from './userStore';

describe('Firebase Realtime Database', () => {
    it('should create a new user', async () => {
      const newUser: User = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        key: '123',
        organizationKey: '123',
      }
      const createdUser = await createUser('123', newUser);
      expect(createdUser).toMatchObject(newUser);
    });
  
    it('should update an existing user', async () => {
      const userKey = '123';
      const newData: User = {
        name: 'Jane Doe',
        email: 'janedoe@example.com',
        key: '123',
        organizationKey: '123',
      }
      await updateUser(userKey, newData);
      const updatedUser = await getUserByKey(userKey);
      expect(updatedUser).toMatchObject(newData);
    });
  
    it('should delete an existing user', async () => {
      const userKey = '123';
      await deleteUser(userKey);
      const deletedUser = await getUserByKey(userKey);
      expect(deletedUser).toBeFalsy();
    });

    it('should create a new persona', async () => {
        const newPersona = { name: 'Admin', capabilities: ['request', 'sendEmail'] };

    });
});