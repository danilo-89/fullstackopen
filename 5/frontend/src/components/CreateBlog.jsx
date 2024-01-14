import { useState } from 'react';

const CreateBlog = ({ handleCreateBlog }) => {
	const [title, setTitle] = useState('');
	const [author, setAuthor] = useState('');
	const [url, setUrl] = useState('');

	const handleSubmission = (event) => {
		event.preventDefault();
		handleCreateBlog({
			title,
			author,
			url,
		});
	};

	return (
		<>
			<h2>create new</h2>
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
		</>
	);
};

export default CreateBlog;
