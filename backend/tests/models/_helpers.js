/**
 * Shared test helpers — creates/destroys real Supabase data for model tests.
 * All test users/ideas are prefixed with 'test_' so they're easy to identify.
 */
const supabase = require('../../config/db');
const User = require('../../models/User');

const uid = () => `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

/**
 * Creates an auth user + public.users row.
 * Returns the public user record.
 */
const createTestUser = async (overrides = {}) => {
  const tag = uid();
  const email = `test_${tag}@ihive-test.internal`;

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password: 'TestPassword123!',
    email_confirm: true,
  });
  if (authError) throw new Error(`Auth user creation failed: ${authError.message}`);

  const user = await User.createUser({
    id: authData.user.id,
    username: `testuser_${tag}`,
    email,
    user_type: 'entrepreneur',
    bio: null,
    ...overrides,
  });

  return user;
};

/**
 * Deletes a public.users row AND the auth user.
 */
const deleteTestUser = async (userId) => {
  await supabase.from('users').delete().eq('id', userId);
  await supabase.auth.admin.deleteUser(userId);
};

module.exports = { createTestUser, deleteTestUser, uid };
