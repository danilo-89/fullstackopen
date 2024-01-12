// npm test -- tests/note_api.test.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user');
const { initialBlogs, wrongToken, getToken } = require('./test_helper');

const api = supertest.agent(app);

beforeAll(async () => {
	// delete all users
	await User.deleteMany({});

	const userData = {
		username: 'tester',
		password: 'secret',
	};

	// create new user
	const passwordHash = await bcrypt.hash(userData.password, 10);
	const user = new User({ username: userData.username, passwordHash });
	const userResponse = await user.save();

	console.log('userResponse');
	console.log(userResponse);

	// get and set Bearer token
	const token = await getToken(api, userData);
	api.auth(token, { type: 'bearer' });
});

beforeEach(async () => {
	await Blog.deleteMany({});
	let noteObject = new Blog(initialBlogs[0]);
	await noteObject.save();
	noteObject = new Blog(initialBlogs[1]);
	await noteObject.save();
}, 100000);

describe('when there is initially some blogs saved', () => {
	test('blogs are returned as json', async () => {
		await api
			.get('/api/blogs')
			.expect(200)
			.expect('Content-Type', /application\/json/);
	}, 100000);

	test('all blogs are returned', async () => {
		const response = await api.get('/api/blogs');
		expect(response.body).toHaveLength(2);
	}, 100000);

	test('unique identifier property of the blog posts is named id', async () => {
		const response = await api.get('/api/blogs');
		response.body.forEach((element) => expect(element.id).toBeDefined());
	}, 100000);
});

describe('addition of new blog', () => {
	test('create and check new blog', async () => {
		let noteObject = new Blog(initialBlogs[2]);
		await noteObject.save();

		const response = await api.get('/api/blogs');
		expect(response.body).toHaveLength(3);
		expect(response.body[2]).toMatchObject({
			author: initialBlogs[2].author,
			likes: initialBlogs[2].likes,
			title: initialBlogs[2].title,
			url: initialBlogs[2].url,
		});
	}, 100000);

	test('verify if likes property is missing then it defaults to 0', async () => {
		const blogData = {
			title: 'Test blog',
			author: 'Robert C. Martin',
			url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
			user: '65a10c0859f7deaefe81808b',
		};

		const response = await api
			.post('/api/blogs')
			.send(blogData)
			.expect(201)
			.expect('Content-Type', /application\/json/);

		expect(response.body.likes).toBeDefined();
		expect(response.body.likes).toBe(0);
	}, 100000);

	test('verify that if the title or url properties are missing from the request data, the backend responds to the request with the status code 400 Bad Request', async () => {
		const blogData = {
			author: 'Robert C. Martin',
			url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
		};

		const response = await api.post('/api/blogs').send(blogData).expect(400);

		expect(response.body.error).toBe('title or url is missing');
	}, 100000);

	test('verify that adding a blog fails with the proper status code when Bearer token is absent', async () => {
		const blogData = {
			author: 'Robert C. Martin',
			url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
		};

		const response = await api
			.post('/api/blogs')
			.unset('Authorization')
			.send(blogData)
			.expect(401);

		expect(response.body.error).toBe('invalid or missing token');
	}, 100000);
});

describe('update of a blog', () => {
	test('verify that blog likes can be updated', async () => {
		const postResponse = await api
			.post('/api/blogs')
			.send(initialBlogs[0])
			.expect(201)
			.expect('Content-Type', /application\/json/);

		const id = postResponse.body.id;

		const patchResponse = await api
			.patch(`/api/blogs/${id}`)
			.send({ likes: 999 })
			.expect(200)
			.expect('Content-Type', /application\/json/);

		expect(patchResponse.body.likes).toBe(999);
	}, 100000);

	test('verify that correct status is returned when there is no likes property inside request body', async () => {
		const postResponse = await api
			.post('/api/blogs')
			.send(initialBlogs[0])
			.expect(201)
			.expect('Content-Type', /application\/json/);

		const id = postResponse.body.id;

		const patchResponse = await api
			.patch(`/api/blogs/${id}`)
			.send({})
			.expect(400);

		expect(patchResponse.body.error).toBe('Likes property is missing');
	}, 100000);
});

describe('deletion of a blog', () => {
	test('verify that blog can be deleted', async () => {
		const postResponse = await api
			.post('/api/blogs')
			.send(initialBlogs[0])
			.expect(201)
			.expect('Content-Type', /application\/json/);

		const id = postResponse.body.id;

		await api.delete(`/api/blogs/${id}`).expect(204);
	}, 100000);

	test('verify that deleting a blog fails with the proper status code when Bearer token is absent', async () => {
		const postResponse = await api
			.post('/api/blogs')
			.send(initialBlogs[0])
			.expect(201)
			.expect('Content-Type', /application\/json/);

		const id = postResponse.body.id;

		const response = await api
			.delete(`/api/blogs/${id}`)
			.unset('Authorization')
			.expect(401);

		expect(response.body.error).toBe('invalid or missing token');
	}, 100000);

	test('verify that deleting a blog fails with the proper status code when Bearer token is wrong', async () => {
		const postResponse = await api
			.post('/api/blogs')
			.send(initialBlogs[0])
			.expect(201)
			.expect('Content-Type', /application\/json/);

		const id = postResponse.body.id;

		const response = await api
			.delete(`/api/blogs/${id}`)
			.set('Authorization', wrongToken)
			.expect(401);

		expect(response.body.error).toBe('invalid or missing token');
	}, 100000);
});

afterAll(async () => {
	console.log('Closing mongoose connection...');
	try {
		await mongoose.connection.close();
		console.log('Mongoose connection closed successfully.');
	} catch (error) {
		console.error('Error closing mongoose connection:', error);
	}
});

process.on('unhandledRejection', (error) => {
	console.error('Unhandled Promise Rejection:', error);
});
