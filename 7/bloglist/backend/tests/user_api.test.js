// npm test -- tests/user_api.test.js

// const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const app = require('../app');
const helper = require('./test_helper');

const api = supertest(app);

beforeEach(async () => {
	await User.deleteMany({});

	const passwordHash = await bcrypt.hash('secret', 10);
	const user = new User({ username: 'root', passwordHash });

	await user.save();
});

describe('when there is initially one user in db', () => {
	test('creation succeeds with a fresh username', async () => {
		const usersAtStart = await helper.usersInDb();

		const newUser = {
			username: 'mluukkai',
			name: 'Matti Luukkainen',
			password: 'salainen',
		};

		await api
			.post('/api/users')
			.send(newUser)
			.expect(201)
			.expect('Content-Type', /application\/json/);

		const usersAtEnd = await helper.usersInDb();
		expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

		const usernames = usersAtEnd.map((u) => u.username);
		expect(usernames).toContain(newUser.username);
	}, 100000);

	test('creation fails with proper statuscode and message if username already taken', async () => {
		const usersAtStart = await helper.usersInDb();

		const newUser = {
			username: 'root',
			name: 'Superuser',
			password: 'salainen',
		};

		const result = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/);

		expect(result.body.error).toContain('expected `username` to be unique');

		const usersAtEnd = await helper.usersInDb();
		expect(usersAtEnd).toEqual(usersAtStart);
	}, 100000);
});

describe('addition of new user', () => {
	test('fails with a new user having a username with less than 3 characters', async () => {
		const newUser = {
			username: 'mluukkai',
			name: 'Matti Luukkainen',
		};

		const response = await api.post('/api/users').send(newUser).expect(400);
		expect(response.body.error).toBe(
			'User validation failed: User password must have at least 3 characters'
		);
	}, 100000);

	test('fails with a new user missing the username field', async () => {
		const newUser = {
			name: 'Matti Luukkainen',
			password: 'salainen',
		};

		const response = await api.post('/api/users').send(newUser).expect(400);
		expect(response.body.error).toBe(
			'User validation failed: username: field required'
		);
	}, 100000);

	test('fails with a new user username field is less than 3', async () => {
		const newUser = {
			username: 'to',
			name: 'Matti Luukkainen',
			password: 'salainen',
		};

		const response = await api.post('/api/users').send(newUser).expect(400);
		expect(response.body.error).toBe(
			'User validation failed: username: must be at least 3 characters long'
		);
	}, 100000);
});
