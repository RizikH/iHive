const Collab = require('../../models/Collab');
const Idea = require('../../models/Idea');
const { createTestUser, deleteTestUser, uid } = require('./_helpers');

let owner;
let collaborator;
let testIdea;

beforeAll(async () => {
  [owner, collaborator] = await Promise.all([createTestUser(), createTestUser()]);
  testIdea = await Idea.create({
    user_id: owner.id,
    title: `Collab Test Idea ${uid()}`,
    description: 'For collab tests',
  });
});

afterAll(async () => {
  await Idea.remove(testIdea.id).catch(() => {});
  await deleteTestUser(owner.id);
  await deleteTestUser(collaborator.id);
});

describe('Collab.add', () => {
  it('adds a collaborator with public permissions', async () => {
    const collab = await Collab.add(testIdea.id, collaborator.id, 'public');
    expect(collab.idea_id).toBe(testIdea.id);
    expect(collab.user_id).toBe(collaborator.id);
    expect(collab.permissions).toBe('public');
  });

  it('throws on duplicate (same user+idea)', async () => {
    await expect(Collab.add(testIdea.id, collaborator.id, 'public')).rejects.toThrow();
  });
});

describe('Collab.getByIdeaId', () => {
  it('returns collaborators for the idea', async () => {
    const collabs = await Collab.getByIdeaId(testIdea.id);
    expect(Array.isArray(collabs)).toBe(true);
    expect(collabs.some(c => c.user_id === collaborator.id)).toBe(true);
  });

  it('returns empty array for an idea with no collaborators', async () => {
    const alone = await Idea.create({
      user_id: owner.id,
      title: `Solo Idea ${uid()}`,
      description: 'no collabs',
    });
    const collabs = await Collab.getByIdeaId(alone.id);
    expect(collabs).toEqual([]);
    await Idea.remove(alone.id);
  });
});

describe('Collab.update', () => {
  it('changes the permission level', async () => {
    const updated = await Collab.update(testIdea.id, collaborator.id, 'private');
    expect(updated.permissions).toBe('private');
  });
});

describe('Collab.remove', () => {
  it('removes the collaborator and returns the row', async () => {
    const removed = await Collab.remove(testIdea.id, collaborator.id);
    expect(removed.user_id).toBe(collaborator.id);
  });

  it('throws when removing a non-existent collaboration', async () => {
    await expect(Collab.remove(testIdea.id, collaborator.id)).rejects.toThrow();
  });
});
