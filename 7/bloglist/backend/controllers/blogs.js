const blogsRouter = require('express').Router();

const Blog = require('../models/blog');

// API Endpoints
blogsRouter.get('/', async (request, response) => {
	try {
		const blogs = await Blog.find({})
			.find({})
			.populate('user', { username: 1, name: 1 });
		response.json(blogs);
	} catch (error) {
		// Handle any errors that occur during the database query
		console.error('Error fetching blogs:', error);
		response.status(500).json({ error: 'Internal Server Error' });
	}
});

blogsRouter.get('/:id', async (request, response) => {
	try {
		const id = request.params.id;
		const blog = await Blog.findOne({ _id: id })
			.populate('comments')
			.populate('user', { username: 1, name: 1 });

		if (!blog) {
			// If the blog with the given ID is not found, send a 404 Not Found response
			return response.status(404).json({ error: 'Blog not found' });
		}

		response.json(blog);
	} catch (error) {
		// Handle any errors that occur during the database query
		console.error('Error fetching blog:', error);
		response.status(500).json({ error: 'Internal Server Error' });
	}
});

blogsRouter.post('/', async (request, response) => {
	try {
		const user = request.user;

		if (!user) {
			return response.status(401).json({ error: 'invalid or missing token' });
		}

		const blog = new Blog({ ...request.body, user: user.id });
		const result = await blog.save();

		// Update the User document
		user.blogs = user.blogs.concat(result._id);
		await user.save();

		response.status(201).json(result);
	} catch (error) {
		// Handle any errors that occur during the save operation
		console.error('Error saving blog:', error);

		if (error?.errors?.title?.message === 'field required') {
			response.status(400).json({ error: 'title or url is missing' });
		} else {
			response.status(500).json({ error: 'Internal Server Error' });
		}
	}
});

blogsRouter.delete('/:id', async (request, response) => {
	try {
		const user = request.user;

		if (!user) {
			return response.status(401).json({ error: 'invalid or missing token' });
		}

		const blog = await Blog.findById(request.params.id);
		if (blog.user.toString() === request.user.id) {
			await Blog.findByIdAndDelete(request.params.id);
			response.status(204).end();
		} else {
			return response
				.status(401)
				.json({ error: 'Unauthorized to delete the blog' });
		}
	} catch (error) {
		console.error('Error deleting blog:', error);
		response.status(500).json({ error: 'Internal Server Error' });
	}
});

blogsRouter.patch('/:id', async (request, response) => {
	const id = request.params.id;

	if (request.body.likes) {
		try {
			const blog = {
				likes: request.body.likes,
			};
			const result = await Blog.findByIdAndUpdate(id, blog, { new: true });
			response.json(result);
		} catch (error) {
			console.error('Error patching blog:', error);
			response.status(500).json({ error: 'Internal Server Error' });
		}
	} else {
		response.status(400).send({ error: 'Likes property is missing' });
	}
});

blogsRouter.put('/:id', async (request, response) => {
	const id = request.params.id;

	try {
		const result = await Blog.findByIdAndUpdate(id, request.body, {
			new: true,
		});
		response.json(result);
	} catch (error) {
		console.error('Error patching blog:', error);
		response.status(500).json({ error: 'Internal Server Error' });
	}
});

module.exports = blogsRouter;
