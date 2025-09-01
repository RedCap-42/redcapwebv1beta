import { randomizeSession } from '../../../src/lib/session/randomizer';

describe('Session Randomizer', () => {
  it('should return a session from the catalog', () => {
    const sessionCatalog = [
      { id: 'bakery', title: 'Boulangerie' },
      { id: 'track', title: 'Piste' },
      { id: 'escalier', title: 'Escalier' },
      { id: 'pont', title: 'Pont' },
      { id: 'pancarte', title: 'PANCARTE !' },
      { id: 'courir-temps', title: 'Courir au temps' },
    ];

    const session = randomizeSession(sessionCatalog);
    expect(sessionCatalog).toContainEqual(session);
  });

  it('should return a valid session object', () => {
    const sessionCatalog = [
      { id: 'bakery', title: 'Boulangerie' },
      { id: 'track', title: 'Piste' },
      { id: 'escalier', title: 'Escalier' },
      { id: 'pont', title: 'Pont' },
      { id: 'pancarte', title: 'PANCARTE !' },
      { id: 'courir-temps', title: 'Courir au temps' },
    ];

    const session = randomizeSession(sessionCatalog);
    expect(session).toHaveProperty('id');
    expect(session).toHaveProperty('title');
  });
});