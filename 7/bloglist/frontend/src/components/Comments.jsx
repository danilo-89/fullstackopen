import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';

// Services
import commentsService from '../services/comments';

const Comments = ({ comments }) => {
	const queryClient = useQueryClient();

	const id = useParams().id;
	const dispatch = useDispatch();
	const [comment, setComment] = useState('');

	const user = useSelector((state) => state.user);

	const handleCreateComment = async (e) => {
		try {
			const response = await commentsService.createComment(user.token, {
				content: comment,
				blog: id,
			});

			console.log(response);
			setComment('');
			queryClient.invalidateQueries({
				queryKey: ['blog', id],
				refetchType: 'active',
			});
		} catch (err) {
			console.log(err);
		}
	};

	const onFormSubmit = (e) => {
		console.log(e);
		e.preventDefault();
		handleCreateComment(e);
	};

	return (
		<div>
			<h3>comments</h3>
			<form onSubmit={onFormSubmit}>
				<input
					type='text'
					name='comment'
					id='comment'
					value={comment}
					onChange={(e) => setComment(e.target.value)}
					className='mr-2'
				/>
				<button type='submit'>add comment</button>
			</form>
			<ul>
				{comments.map((item) => (
					<li
						key={item.id}
						className='py-0.5 px-2 bg-purple-50 mb-1 rounded-sm'
					>
						{item.content}
					</li>
				))}
			</ul>
		</div>
	);
};

export default Comments;
