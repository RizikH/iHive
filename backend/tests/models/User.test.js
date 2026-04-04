const supabase = require('../../config/db');
const User = require('../../models/User');
const { deleteTestUser, uid } = require('./_helpers');

const FAKE_UUID = '00000000-0000-0000-0000-000000000000';

let testUserId;
let testEmail;

beforeAll(async () => {
  const tag = uid();
  testEmail = `test_${tag}@ihive-test.internal`;

  const { data, error } = await supabase.auth.admin.createUser({
    email: testEmail,
    password: 'TestPassword123!',
    email_confirm: true,
  });
  if (error) throw error;
  testUserId = data.user.id;
});

afterAll(async () => {
  await deleteTestUser(testUserId);
});

describe('User.createUser', () => {
  it('creates a user row linked to the auth user', async () => {
    const user = await User.createUser({
      id: testUserId,
      username: `testuser_${uid()}`,
      email: testEmail,
      user_type: 'entrepreneur',
    });

    expect(user.id).toBe(testUserId);
    expect(user.email).toBe(testEmail);
    expect(user.user_type).toBe('entrepreneur');
  });
});

describe('User.getUserById', () => {
  it('returns an array with the matching user', async () => {
    const result = await User.getUserById(testUserId);
    expect(Array.isArray(result)).toBe(true);
    expect(result[0].id).toBe(testUserId);
  });

  it('returns empty array for non-existent id', async () => {
    const result = await User.getUserById(FAKE_UUID);
    expect(result).toEqual([]);
  });
});

describe('User.getUserByEmail', () => {
  it('returns the user for a known email', async () => {
    const user = await User.getUserByEmail(testEmail);
    expect(user.email).toBe(testEmail);
  });

  it('throws for an unknown email', async () => {
    await expect(User.getUserByEmail('nobody@ihive-test.internal')).rejects.toThrow();
  });
});

describe('User.getUsersByQuery', () => {
  it('returns matching users excluding the given id', async () => {
    const result = await User.getUsersByQuery('testuser', FAKE_UUID);
    expect(Array.isArray(result)).toBe(true);
    result.forEach(u => expect(u.id).not.toBe(FAKE_UUID));
  });

  it('returns empty array for a query that matches nothing', async () => {
    const result = await User.getUsersByQuery('zzz_no_match_zzz', FAKE_UUID);
    expect(result).toEqual([]);
  });
});

describe('User.updateUser', () => {
  it('updates the bio field', async () => {
    const updated = await User.updateUser(testUserId, { bio: 'Updated bio' });
    expect(updated.bio).toBe('Updated bio');
  });
});

describe('User.getAllUsers', () => {
  it('returns an array of users', async () => {
    const users = await User.getAllUsers();
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThan(0);
  });
});
