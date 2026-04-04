const Investment = require('../../models/Investment');
const Idea = require('../../models/Idea');
const { createTestUser, deleteTestUser, uid } = require('./_helpers');

const FAKE_UUID = '00000000-0000-0000-0000-000000000000';

let entrepreneur;
let investor;
let testIdea;
let testInvestmentId;

beforeAll(async () => {
  [entrepreneur, investor] = await Promise.all([
    createTestUser({ user_type: 'entrepreneur' }),
    createTestUser({ user_type: 'investor' }),
  ]);
  testIdea = await Idea.create({
    user_id: entrepreneur.id,
    title: `Investment Test Idea ${uid()}`,
    description: 'For investment tests',
  });
});

afterAll(async () => {
  await Idea.remove(testIdea.id).catch(() => {});
  await deleteTestUser(entrepreneur.id);
  await deleteTestUser(investor.id);
});

describe('Investment.create', () => {
  it('creates an investment with pending status', async () => {
    const investment = await Investment.create({
      idea_id: testIdea.id,
      user_id: investor.id,
      amount: 5000,
    });

    expect(investment.id).toBeDefined();
    expect(Number(investment.amount)).toBe(5000);
    expect(investment.status).toBe('pending');
    testInvestmentId = investment.id;
  });
});

describe('Investment.getByIdeaId', () => {
  it('returns investments for the idea', async () => {
    const investments = await Investment.getByIdeaId(testIdea.id);
    expect(Array.isArray(investments)).toBe(true);
    expect(investments.some(i => i.id === testInvestmentId)).toBe(true);
  });

  it('returns empty array for an idea with no investments', async () => {
    const investments = await Investment.getByIdeaId(FAKE_UUID);
    expect(investments).toEqual([]);
  });
});

describe('Investment.getByUserId', () => {
  it('returns investments made by the investor', async () => {
    const investments = await Investment.getByUserId(investor.id);
    expect(investments.some(i => i.id === testInvestmentId)).toBe(true);
  });

  it('returns empty array for a user with no investments', async () => {
    const investments = await Investment.getByUserId(FAKE_UUID);
    expect(investments).toEqual([]);
  });
});

describe('Investment.getForEntrepreneur', () => {
  it('returns ideas with nested investments for the entrepreneur', async () => {
    const ideas = await Investment.getForEntrepreneur(entrepreneur.id);
    expect(Array.isArray(ideas)).toBe(true);
    const idea = ideas.find(i => i.id === testIdea.id);
    expect(idea).toBeDefined();
    expect(Array.isArray(idea.investments)).toBe(true);
  });

  it('returns empty array for a user with no ideas', async () => {
    const result = await Investment.getForEntrepreneur(FAKE_UUID);
    expect(result).toEqual([]);
  });
});

describe('Investment.updateStatus', () => {
  it('updates status to accepted', async () => {
    const updated = await Investment.updateStatus(testInvestmentId, 'accepted');
    expect(updated.status).toBe('accepted');
  });

  it('updates status to rejected', async () => {
    const updated = await Investment.updateStatus(testInvestmentId, 'rejected');
    expect(updated.status).toBe('rejected');
  });
});
