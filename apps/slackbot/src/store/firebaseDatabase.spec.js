const firebaseDatabase = require('./firebaseDatabase');

describe('Firebase Realtime Database', () => {
    it('should create a new user', async () => {
      const newUser = { name: 'John Doe', email: 'johndoe@example.com' };
      const createdUser = await firebaseDatabase.createUser('123', newUser);
      expect(createdUser).toMatchObject(newUser);
    });
  
    it('should update an existing user', async () => {
      const userKey = '123';
      const newData = { name: 'Jane Doe', email: 'janedoe@example.com' };
      await firebaseDatabase.updateUser(userKey, newData);
      const updatedUser = await firebaseDatabase.getUserByKey(userKey);
      expect(updatedUser).toMatchObject(newData);
    });
  
    it('should delete an existing user', async () => {
      const userKey = '123';
      await firebaseDatabase.deleteUser(userKey);
      const deletedUser = await firebaseDatabase.getUserByKey(userKey);
      expect(deletedUser).toBeFalsy();
    });
});