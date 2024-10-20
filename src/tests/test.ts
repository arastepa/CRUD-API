import request from 'supertest';
import { server } from '../index'; // Replace with the actual path to your server file

describe('CRUD API tests for /api/users', () => {
  let createdUserId: string;

  it('should return an empty array when no users exist', async () => {
    const res = await request(server).get('/users');
    console.log(res);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('should create a new user and return the user object', async () => {
    const newUser = {
      username: 'John Doe',
      age: 30,
      hobbies: ['reading', 'coding'],
    };

    const res = await request(server).post('/users').send(newUser);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.username).toBe(newUser.username);
    expect(res.body.age).toBe(newUser.age);
    expect(res.body.hobbies).toEqual(newUser.hobbies);

    createdUserId = res.body.id; // Save the created user's ID for further tests
  });

  it('should retrieve the created user by ID', async () => {
    const res = await request(server).get(`/users/${createdUserId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(createdUserId);
    expect(res.body.username).toBe('John Doe');
    expect(res.body.age).toBe(30);
    expect(res.body.hobbies).toEqual(['reading', 'coding']);
  });

  it('should update the user data', async () => {
    const updatedUser = {
      username: 'Jane Doe',
      age: 32,
      hobbies: ['hiking', 'gaming'],
    };

    const res = await request(server).put(`/users/${createdUserId}`).send(updatedUser);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(createdUserId);
    expect(res.body.username).toBe(updatedUser.username);
    expect(res.body.age).toBe(updatedUser.age);
    expect(res.body.hobbies).toEqual(updatedUser.hobbies);
  });

  it('should delete the user by ID', async () => {
    const res = await request(server).delete(`/users/${createdUserId}`);
    expect(res.statusCode).toBe(204);
  });

  it('should return 404 for a deleted user', async () => {
    const res = await request(server).get(`/users/${createdUserId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('User not found');
  });
});
