import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery, useQueryClient } from '@tanstack/react-query';

// Services
import blogsService from '../services/blogs';

// Components
import Comments from '../components/Comments';

import { likeBlog } from '../reducers/blogReducer';

const User = () => {
	const queryClient = useQueryClient();

	const dispatch = useDispatch();
	const user = useSelector((state) => state.user);
	const id = useParams().id;

	const { data } = useQuery({
		queryKey: ['blog', id],
		queryFn: async () => await blogsService.getBlog(id),
	});

	const handleLikeBlog = async (blog) => {
		const { user: _user, id, comments, ...requiredData } = blog;

		const data = {
			...requiredData,
			likes: ++requiredData.likes,
			user: blog.user.id,
		};

		try {
			await dispatch(likeBlog(user.token, data, id, queryClient));
		} catch (error) {
			console.log(error);
		}
	};

	if (!data) {
		return null;
	}

	return (
		<div>
			<div className='mb-4'>
				<h2>
					{data.title} {data.author}
				</h2>
				<a href={data.url} target='_blank' rel='noopener noreferrer'>
					{data.url}
				</a>
				<p>
					{data.likes} likes{' '}
					<button type='button' onClick={() => handleLikeBlog(data)}>
						like
					</button>
				</p>
				<p>added by {data.user.name || data.user.username}</p>
			</div>

			<Comments comments={data.comments} />
		</div>
	);
};

export default User;
