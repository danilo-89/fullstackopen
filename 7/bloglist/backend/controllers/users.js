const bcrypt = require('bcryptjs');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.get('/', async (request, response) => {
	const users = await User.find({}).find({}).populate('blogs');
	// .find({}).populate('blogs', { title: 1, url: 1 })
	response.json(users);
});

usersRouter.get('/:id', async (request, response) => {
	const id = request.params.id;
	const user = await User.findOne({ _id: id }).populate('blogs');
	// .find({}).populate('blogs', { title: 1, url: 1 })
	response.json(user);
});

usersRouter.post('/', async (request, response) => {
	const { username, name, password } = request.body;

	if (typeof password !== 'string' || password?.length < 3) {
		response.status(400).json({
			error:
				'User validation failed: User password must have at least 3 characters',
		});
	} else {
		const saltRounds = 10;
		const passwordHash = await bcrypt.hash(password, saltRounds);

		const user = new User({
			username,
			name,
			passwordHash,
		});

		const savedUser = await user.save();

		response.status(201).json(savedUser);
	}
});

module.exports = usersRouter;
