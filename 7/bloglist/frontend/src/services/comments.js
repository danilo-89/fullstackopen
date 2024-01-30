import axios from 'axios';
const baseUrl = 'http://localhost:3003/api/comments';

const createComment = async (token, data) => {
	const config = {
		headers: { Authorization: `Bearer ${token}` },
	};

	const request = await axios.post(baseUrl, data, config);
	return request;
};

export default { createComment };
