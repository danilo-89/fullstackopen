import { useSelector, useDispatch } from 'react-redux';

// Reducers
import { voteAnecdote } from '../reducers/anecdoteReducer';

const AnecdoteList = () => {
	const anecdotes = useSelector((state) => {
		if (state.filter) {
			return state.anecdotes.filter(
				(item) =>
					item.content.toLowerCase().includes(state.filter.toLowerCase())
				// .sort((a, b) => b.votes - a.votes) || []
			);
		}
		return [...state.anecdotes]?.sort((a, b) => b.votes - a.votes) || [];
	});

	const dispatch = useDispatch();

	const vote = (item) => {
		console.log('vote', item);
		dispatch(voteAnecdote(item));
	};

	return (
		<>
			{anecdotes.map((anecdote) => (
				<div key={anecdote.id}>
					<div>{anecdote.content}</div>
					<div>
						has {anecdote.votes}
						<button onClick={() => vote(anecdote)}>vote</button>
					</div>
				</div>
			))}
		</>
	);
};

export default AnecdoteList;
