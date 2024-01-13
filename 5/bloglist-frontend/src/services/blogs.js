import axios from 'axios';
const baseUrl = 'http://localhost:3003/api/blogs';

const getAll = async () => {
	const request = await axios.get(baseUrl);
	return request.data;
};

const createNew = async (token, data) => {
	const config = {
		headers: { Authorization: `Bearer ${token}` },
	};

	const request = await axios.post(baseUrl, data, config);
	return request;
};

export default { getAll, createNew };
