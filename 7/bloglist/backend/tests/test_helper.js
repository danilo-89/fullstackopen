const User = require('../models/user');

const initialBlogs = [
	{
		title: 'First one',
		author: 'Johnny T',
		url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
		likes: 9,
	},
	{
		title: 'Second one',
		author: 'Marcy U',
		url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
		likes: 0,
	},
	{
		title: 'Third one',
		author: 'Denny R',
		url: 'http://www.test.com',
		likes: 4,
	},
];

const wrongToken =
	'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpZCI6IjY1YTA2Y2RmZjczZDc0MTI0ZjFjNTcwMyIsImlhdCI6MTcwNTA2MDQyOSwiZXhwIjoxNzA1MDY0MDI5fQ.z7XUvsM1lMtvcfIDMAKMIiiT_CRu9uEI16J4hDyTeZM';

const usersInDb = async () => {
	const users = await User.find({});
	return users.map((u) => u.toJSON());
};

const getToken = async (api, data) => {
	const { username, password } = data;

	const loginResponse = await api.post('/api/login').send({
		username,
		password,
	});

	return loginResponse.body?.token;
};

module.exports = {
	initialBlogs,
	wrongToken,
	usersInDb,
	getToken,
};
