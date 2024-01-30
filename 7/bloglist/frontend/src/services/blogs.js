import axios from 'axios';
const baseUrl = 'http://localhost:3003/api/blogs';

const getAll = async () => {
	const request = await axios.get(baseUrl);
	return request.data;
};

const getBlog = async (id) => {
	const request = await axios.get(`${baseUrl}/${id}`);
	return request.data;
};

const createBlog = async (token, data) => {
	const config = {
		headers: { Authorization: `Bearer ${token}` },
	};

	const request = await axios.post(baseUrl, data, config);
	return request;
};

const likeBlog = async (token, data, id) => {
	const config = {
		headers: { Authorization: `Bearer ${token}` },
	};

	console.log(data);

	const request = await axios.put(`${baseUrl}/${id}`, data, config);
	return request;
};

const deleteBlog = async (token, id) => {
	const config = {
		headers: { Authorization: `Bearer ${token}` },
	};

	const request = await axios.delete(`${baseUrl}/${id}`, config);
	return request;
};

export default { getAll, getBlog, createBlog, likeBlog, deleteBlog };
