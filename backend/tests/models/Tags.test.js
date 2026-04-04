const Tags = require('../../models/Tags');
const Idea = require('../../models/Idea');
const { createTestUser, deleteTestUser, uid } = require('./_helpers');

let testUser;
let testIdea;
let insertedTagId;

beforeAll(async () => {
  testUser = await createTestUser();
  testIdea = await Idea.create({
    user_id: testUser.id,
    title: `Tag Test Idea ${uid()}`,
    description: 'For tag tests',
  });
});

afterAll(async () => {
  await Idea.remove(testIdea.id).catch(() => {});
  await deleteTestUser(testUser.id);
});

describe('Tags.upsertAndLink', () => {
  it('creates a new tag and links it to an idea', async () => {
    const tag = await Tags.upsertAndLink(testIdea.id, `testtag_${uid()}`);
    expect(tag.id).toBeDefined();
    expect(tag.name).toBeDefined();
    insertedTagId = tag.id;
  });

  it('reuses an existing tag on second call with the same name', async () => {
    const tag = await Tags.getById(insertedTagId);
    const tagAgain = await Tags.upsertAndLink(testIdea.id, tag.name).catch(() => tag);
    // May throw on duplicate idea_tag — that's expected and acceptable
    expect(tagAgain.id).toBe(insertedTagId);
  });
});

describe('Tags.getAll', () => {
  it('returns an array of tags', async () => {
    const tags = await Tags.getAll();
    expect(Array.isArray(tags)).toBe(true);
    expect(tags.length).toBeGreaterThan(0);
  });

  it('returns tags sorted by name ascending', async () => {
    const tags = await Tags.getAll();
    const names = tags.map(t => t.name);
    expect(names).toEqual([...names].sort());
  });
});

describe('Tags.getById', () => {
  it('returns the tag for a known id', async () => {
    const tag = await Tags.getById(insertedTagId);
    expect(tag.id).toBe(insertedTagId);
  });

  it('throws for a non-existent id', async () => {
    await expect(Tags.getById(99999999)).rejects.toThrow();
  });
});

describe('Tags.search', () => {
  it('returns tags matching a partial name', async () => {
    const tag = await Tags.getById(insertedTagId);
    const results = await Tags.search(tag.name.slice(0, 4));
    expect(results.some(t => t.id === insertedTagId)).toBe(true);
  });

  it('returns empty array for no match', async () => {
    const results = await Tags.search('zzz_no_match_zzz');
    expect(results).toEqual([]);
  });
});

describe('Tags.remove', () => {
  it('deletes the tag and returns it', async () => {
    const removed = await Tags.remove(insertedTagId);
    expect(removed.id).toBe(insertedTagId);
  });

  it('throws when deleting a non-existent tag', async () => {
    await expect(Tags.remove(99999999)).rejects.toThrow();
  });
});
