const File = require('../../models/File');
const Idea = require('../../models/Idea');
const { createTestUser, deleteTestUser, uid } = require('./_helpers');

const FAKE_UUID = '00000000-0000-0000-0000-000000000000';

let testUser;
let testIdea;
let testFileId;

beforeAll(async () => {
  testUser = await createTestUser();
  testIdea = await Idea.create({
    user_id: testUser.id,
    title: `File Test Idea ${uid()}`,
    description: 'For file model tests',
  });
});

afterAll(async () => {
  await Idea.remove(testIdea.id).catch(() => {});
  await deleteTestUser(testUser.id);
});

describe('File.create', () => {
  it('creates a text file record', async () => {
    const file = await File.create({
      name: 'README.md',
      type: 'file',
      idea_id: testIdea.id,
      user_id: testUser.id,
      content: '# Hello World',
      permission_level: 'private',
    });

    expect(file.id).toBeDefined();
    expect(file.name).toBe('README.md');
    expect(file.idea_id).toBe(testIdea.id);
    testFileId = file.id;
  });

  it('creates a folder record (no content)', async () => {
    const folder = await File.create({
      name: 'docs',
      type: 'folder',
      idea_id: testIdea.id,
      user_id: testUser.id,
    });
    expect(folder.type).toBe('folder');
    expect(folder.content).toBeNull();
  });
});

describe('File.getAll', () => {
  it('returns all files for the idea', async () => {
    const files = await File.getAll(testIdea.id);
    expect(Array.isArray(files)).toBe(true);
    expect(files.some(f => f.id === testFileId)).toBe(true);
  });

  it('returns empty array for an idea with no files', async () => {
    const files = await File.getAll(FAKE_UUID);
    expect(files).toEqual([]);
  });
});

describe('File.getById', () => {
  it('returns the file for a known id', async () => {
    const file = await File.getById(testFileId);
    expect(file.id).toBe(testFileId);
    expect(file.content).toBe('# Hello World');
  });

  it('throws for a non-existent id', async () => {
    await expect(File.getById(FAKE_UUID)).rejects.toThrow();
  });
});

describe('File.update', () => {
  it('updates the file content', async () => {
    const updated = await File.update(testFileId, { content: '# Updated' });
    expect(updated.content).toBe('# Updated');
  });

  it('updates permission_level', async () => {
    const updated = await File.update(testFileId, { permission_level: 'public' });
    expect(updated.permission_level).toBe('public');
  });
});

describe('File.remove', () => {
  it('deletes the file', async () => {
    const result = await File.remove(testFileId);
    expect(result.success).toBe(true);
    testFileId = null;
  });

  it('getById throws after deletion', async () => {
    await expect(File.getById(FAKE_UUID)).rejects.toThrow();
  });
});
