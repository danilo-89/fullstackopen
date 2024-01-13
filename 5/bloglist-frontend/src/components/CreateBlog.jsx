import { useState } from 'react';
import blogsServices from '../services/blogs';

const CreateBlog = ({ user, setBlogs, setNotification }) => {
	const [title, setTitle] = useState('');
	const [author, setAuthor] = useState('');
	const [url, setUrl] = useState('');

	const handleSubmission = async (event) => {
		event.preventDefault();
		try {
			const postResponse = await blogsServices.createNew(user.token, {
				title,
				author,
				url,
			});
			console.log(postResponse);

			if (postResponse.status === 201) {
				setBlogs((curr) => [...curr, postResponse.data]);
				setNotification({
					message: `Blog created successfully: ${postResponse.data.title} ${postResponse.data.author}`,
					status: 'success',
				});
			}
		} catch (error) {
			setNotification({
				message: error?.response?.data?.error || error?.message,
				status: 'error',
			});
		}
	};

	return (
		<form onSubmit={handleSubmission}>
			<div>
				<label htmlFor='title'>title</label>
				<input
					type='text'
					name='title'
					id='title'
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
			</div>
			<div>
				<label htmlFor='author'>author</label>
				<input
					type='text'
					name='author'
					id='author'
					value={author}
					onChange={(e) => setAuthor(e.target.value)}
				/>
			</div>
			<div>
				<label htmlFor='url'>url</label>
				<input
					type='text'
					name='url'
					id='url'
					value={url}
					onChange={(e) => setUrl(e.target.value)}
				/>
			</div>
			<button type='submit'>create</button>
		</form>
	);
};

export default CreateBlog;
