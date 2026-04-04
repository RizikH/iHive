const Idea = require('../../models/Idea');
const { createTestUser, deleteTestUser, uid } = require('./_helpers');

const FAKE_UUID = '00000000-0000-0000-0000-000000000000';

let testUser;
let testIdeaId;

beforeAll(async () => {
  testUser = await createTestUser();
});

afterAll(async () => {
  if (testIdeaId) await Idea.remove(testIdeaId).catch(() => {});
  await deleteTestUser(testUser.id);
});

describe('Idea.create', () => {
  it('creates an idea and returns it', async () => {
    const idea = await Idea.create({
      user_id: testUser.id,
      title: `Test Idea ${uid()}`,
      description: 'A test description',
    });

    expect(idea.id).toBeDefined();
    expect(idea.user_id).toBe(testUser.id);
    expect(idea.status).toBe('open');
    testIdeaId = idea.id;
  });
});

describe('Idea.getById', () => {
  it('returns the idea for a known id', async () => {
    const idea = await Idea.getById(testIdeaId);
    expect(idea.id).toBe(testIdeaId);
  });

  it('throws for a non-existent id', async () => {
    await expect(Idea.getById(FAKE_UUID)).rejects.toThrow();
  });
});

describe('Idea.getAll', () => {
  it('returns an array including the test idea', async () => {
    const ideas = await Idea.getAll();
    expect(Array.isArray(ideas)).toBe(true);
    expect(ideas.some(i => i.id === testIdeaId)).toBe(true);
  });
});

describe('Idea.getAllByUserId', () => {
  it('returns ideas owned by the user', async () => {
    const ideas = await Idea.getAllByUserId(testUser.id);
    expect(ideas.every(i => i.user_id === testUser.id)).toBe(true);
    expect(ideas.some(i => i.id === testIdeaId)).toBe(true);
  });

  it('returns empty array for a user with no ideas', async () => {
    const ideas = await Idea.getAllByUserId(FAKE_UUID);
    expect(ideas).toEqual([]);
  });
});

describe('Idea.update', () => {
  it('updates the category and status fields', async () => {
    const updated = await Idea.update(testIdeaId, { category: 'tech', status: 'funded' });
    expect(updated.category).toBe('tech');
    expect(updated.status).toBe('funded');
  });
});

describe('Idea.searchByTitle', () => {
  it('returns ideas matching a partial title', async () => {
    const idea = await Idea.getById(testIdeaId);
    const results = await Idea.searchByTitle(idea.title.slice(0, 8));
    expect(results.some(i => i.id === testIdeaId)).toBe(true);
  });

  it('returns empty array for a title with no match', async () => {
    const results = await Idea.searchByTitle('zzz_absolutely_no_match_zzz');
    expect(results).toEqual([]);
  });
});

describe('Idea.searchByTagIds', () => {
  it('returns empty array when no ideas have the given tags', async () => {
    const results = await Idea.searchByTagIds([99999]);
    expect(results).toEqual([]);
  });
});

describe('Idea.remove', () => {
  it('deletes the idea and returns it', async () => {
    const removed = await Idea.remove(testIdeaId);
    expect(removed.id).toBe(testIdeaId);
    testIdeaId = null;
  });
});
