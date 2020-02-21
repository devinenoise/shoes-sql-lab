const request = require('supertest');

describe('GET API/SHOES ', () => {
    test('It should respond with correctly formatted data', async (done) => {
        const response = await request(`https://rocky-basin-80195.herokuapp.com`)
            .get('/api/shoes');

        expect(response.body).toEqual({
            name: expect.any(String),
            type: expect.any(String),
            url: expect.any(String),
            brand: expect.any(String),
            laces: expect.any(String)
        });
        expect(response.statusCode).toBe(200);

        done();
    });
});

