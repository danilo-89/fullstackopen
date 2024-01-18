import { useDispatch } from 'react-redux';

// Reducers
import { createAnecdote } from '../reducers/anecdoteReducer';

const AnecdoteForm = () => {
	const dispatch = useDispatch();

	const onSubmitAnecdote = async (e) => {
		e.preventDefault();
		const content = e.target.anecdoteInput.value;
		console.log(content);

		dispatch(createAnecdote(content));
	};

	return (
		<>
			<h2>create new</h2>
			<form onSubmit={onSubmitAnecdote}>
				<div>
					<input name='anecdoteInput' />
				</div>
				<button type='submit'>create</button>
			</form>
		</>
	);
};

export default AnecdoteForm;
