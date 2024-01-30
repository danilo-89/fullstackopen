import axios from 'axios';
const baseUrl = 'http://localhost:3003/api/users';

const getAll = async () => {
	const request = await axios.get(baseUrl);
	return request.data;
};

const getUser = async (id) => {
	const request = await axios.get(`${baseUrl}/${id}`);
	return request.data;
};

export default { getAll, getUser };
