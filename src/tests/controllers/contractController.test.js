const request = require('supertest');
const app = require('../../app');

describe('Contract Controller', () => {
  it('should get non-terminated contracts for a user', async () => {
    const response = await request(app)
      .get('/contracts')
      .set('profile_id', '1');

    expect(response.status).toBe(200);
  });

  it('should get a specific contract by ID', async () => {
    const contractId = '2';
    const response = await request(app)
      .get(`/contracts/${contractId}`)
      .set('profile_id', '1');

    expect(response.status).toBe(200);
  });
});
