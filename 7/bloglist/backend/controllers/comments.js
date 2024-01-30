const commentsRouter = require('express').Router();

const Comment = require('../models/comment');
const Blog = require('../models/blog');

// API Endpoints
commentsRouter.get('/', async (request, response) => {
	try {
		const comments = await Comment.find({}).find({}).populate('blog', {});
		response.json(comments);
	} catch (error) {
		// Handle any errors that occur during the database query
		console.error('Error fetching comments:', error);
		response.status(500).json({ error: 'Internal Server Error' });
	}
});

commentsRouter.get('/:id', async (request, response) => {
	try {
		const id = request.params.id;
		const comment = await Comment.findOne({ _id: id }).populate('blog', {});

		response.json(comment);
	} catch (error) {
		// Handle any errors that occur during the database query
		console.error('Error fetching comments:', error);
		response.status(500).json({ error: 'Internal Server Error' });
	}
});

commentsRouter.post('/', async (request, response) => {
	try {
		const user = request.user;

		console.log(user);
		// console.log('test request', request);

		if (!user) {
			return response.status(401).json({ error: 'invalid or missing token' });
		}

		const comment = new Comment({ ...request.body });
		const result = await comment.save();

		// Update the Blog document
		const blog = await Blog.findById(request.body.blog);
		blog.comments.push(result._id);
		await blog.save();

		response.status(201).json(result);
	} catch (error) {
		// Handle any errors that occur during the save operation
		console.error('Error saving comment:', error);

		if (error?.errors?.title?.message === 'field required') {
			response.status(400).json({ error: 'field missing' });
		} else {
			response.status(500).json({ error: 'Internal Server Error' });
		}
	}
});

module.exports = commentsRouter;
