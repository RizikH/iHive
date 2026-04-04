const ChatRoom = require('../../models/ChatRoom');
const { createTestUser, deleteTestUser } = require('./_helpers');

let userA;
let userB;
let roomId;

beforeAll(async () => {
  [userA, userB] = await Promise.all([createTestUser(), createTestUser()]);
});

afterAll(async () => {
  await deleteTestUser(userA.id);
  await deleteTestUser(userB.id);
});

describe('ChatRoom.findDmRoom', () => {
  it('returns null when no room exists between the users', async () => {
    const room = await ChatRoom.findDmRoom(userA.id, userB.id);
    expect(room).toBeNull();
  });
});

describe('ChatRoom.createDmRoom', () => {
  it('creates a chat room and adds both users as participants', async () => {
    const room = await ChatRoom.createDmRoom(userA.id, userB.id);
    expect(room.id).toBeDefined();
    roomId = room.id;
  });
});

describe('ChatRoom.findDmRoom (after creation)', () => {
  it('finds the existing room', async () => {
    const room = await ChatRoom.findDmRoom(userA.id, userB.id);
    expect(room).not.toBeNull();
    expect(room.id).toBe(roomId);
  });
});

describe('ChatRoom.getOrCreateDmRoom', () => {
  it('returns the existing room instead of creating a new one', async () => {
    const room = await ChatRoom.getOrCreateDmRoom(userA.id, userB.id);
    expect(room.id).toBe(roomId);
  });

  it('creates a new room for a pair that has never chatted', async () => {
    const thirdUser = await createTestUser();
    const room = await ChatRoom.getOrCreateDmRoom(userA.id, thirdUser.id);
    expect(room.id).toBeDefined();
    expect(room.id).not.toBe(roomId);
    await deleteTestUser(thirdUser.id);
  });
});
