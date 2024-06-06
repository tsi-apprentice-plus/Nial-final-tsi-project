import { agent } from 'supertest';
import app from '../src/app';
import { createHttpServer } from '../src/index';

const httpServer = createHttpServer();
const request = agent(httpServer);

describe('Post Route', () => {
    describe('POST empty', () => {
        test('should return 400 if validation fails', async () => {
            const response = await request(app)
                .post('/users')
                .send({}); // Sending an empty request body to trigger validation errors

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('errors');
        });
    });
    describe('POST with valid data', () => {
        test('should return 201 if validation passes', async () => {
            const response = await request(app)
                .post('/users')
                .send({ username: 'test', email: 'abc@abc.com', password: '123abc'});
            expect(response.status).toBe(200);
        });
    })
    describe('POST with invalid email', () => {
        test('no @', async () => {
            const response = await request(app)
                .post('/users')
                .send({ username: 'test', email: 'abcabc.com', password: '123'});
            expect(response.status).toBe(200);
        });
        test('no email user', async () => {
            const response = await request(app)
                .post('/users')
                .send({ username: 'test', email: '@abc.com', password: '123'});
            expect(response.status).toBe(200);
        });
        test('no email domain', async () => {
            const response = await request(app)
                .post('/users')
                .send({ username: 'test', email: 'abc@.com', password: '123'});
            expect(response.status).toBe(200);
        });
        test('no TLD', async () => {
            const response = await request(app)
                .post('/users')
                .send({ username: 'test', email: 'abc@abc', password: '123'});
            expect(response.status).toBe(200);
        });
    }) 
});


