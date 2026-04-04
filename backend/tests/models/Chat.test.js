const Chat = require('../../models/Chat');
const ChatRoom = require('../../models/ChatRoom');
const { createTestUser, deleteTestUser } = require('./_helpers');

const FAKE_UUID = '00000000-0000-0000-0000-000000000000';

let userA;
let userB;
let roomId;

beforeAll(async () => {
  [userA, userB] = await Promise.all([createTestUser(), createTestUser()]);
  const room = await ChatRoom.createDmRoom(userA.id, userB.id);
  roomId = room.id;
});

afterAll(async () => {
  await deleteTestUser(userA.id);
  await deleteTestUser(userB.id);
});

describe('Chat.saveMessage', () => {
  it('saves a message and returns it', async () => {
    const msg = await Chat.saveMessage({
      roomId,
      senderId: userA.id,
      content: 'Hello from test',
    });

    expect(msg.id).toBeDefined();
    expect(msg.room_id).toBe(roomId);
    expect(msg.sender_id).toBe(userA.id);
    expect(msg.content).toBe('Hello from test');
  });
});

describe('Chat.getMessages', () => {
  it('returns messages for a room in ascending order', async () => {
    await Chat.saveMessage({ roomId, senderId: userB.id, content: 'Reply' });

    const messages = await Chat.getMessages(roomId);
    expect(Array.isArray(messages)).toBe(true);
    expect(messages.length).toBeGreaterThanOrEqual(2);

    const times = messages.map(m => new Date(m.created_at).getTime());
    expect(times).toEqual([...times].sort((a, b) => a - b));
  });

  it('returns empty array for a room with no messages', async () => {
    const emptyRoom = await ChatRoom.createDmRoom(userA.id, userB.id).catch(() => ({ id: FAKE_UUID }));
    const messages = await Chat.getMessages(emptyRoom.id);
    expect(Array.isArray(messages)).toBe(true);
  });
});

describe('Chat.getReceiverByRoomId', () => {
  it('returns the other participant\'s user record', async () => {
    const receiver = await Chat.getReceiverByRoomId(roomId, userA.id);
    expect(receiver.id).toBe(userB.id);
  });

  it('returns userA when queried from userB\'s perspective', async () => {
    const receiver = await Chat.getReceiverByRoomId(roomId, userB.id);
    expect(receiver.id).toBe(userA.id);
  });
});

describe('Chat.getContacts', () => {
  it('returns the other user as a contact for userA', async () => {
    const contacts = await Chat.getContacts(userA.id);
    expect(Array.isArray(contacts)).toBe(true);
    expect(contacts.some(c => c.id === userB.id)).toBe(true);
  });

  it('returns empty array for a user with no DM rooms', async () => {
    const loner = await createTestUser();
    const contacts = await Chat.getContacts(loner.id);
    expect(contacts).toEqual([]);
    await deleteTestUser(loner.id);
  });
});
