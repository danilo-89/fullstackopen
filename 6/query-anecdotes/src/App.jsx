import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Context
import { useNotificationDispatch } from './context/NotificationContext';

// Services
import {
	getAnecdotes,
	createAnecdote,
	voteAnecdote,
} from './services/requests';

// Components
import AnecdoteForm from './components/AnecdoteForm';
import Notification from './components/Notification';

const App = () => {
	const queryClient = useQueryClient();
	const dispatch = useNotificationDispatch();

	const result = useQuery({
		queryKey: ['anecdotes'],
		queryFn: getAnecdotes,
	});
	console.log(JSON.parse(JSON.stringify(result)));

	const anecdotes = result.data;

	const newAnecdoteMutation = useMutation({
		mutationFn: createAnecdote,
		onSuccess: (newAnecdote) => {
			// queryClient.invalidateQueries({ queryKey: ['anecdotes'] });
			const anecdotes = queryClient.getQueryData(['anecdotes']);
			queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote));
			dispatch({ type: 'CREATED', value: newAnecdote.content });
		},
		onError: (anecdoteError) => {
			console.log(anecdoteError);
			dispatch({ type: 'ERROR', value: anecdoteError.response.data.error });
		},
	});

	const handleVote = useMutation({
		mutationFn: voteAnecdote,
		onSuccess: (newAnecdote) => {
			// queryClient.invalidateQueries({ queryKey: ['anecdotes'] });
			const anecdotes = [...queryClient.getQueryData(['anecdotes'])];
			const index = anecdotes.findIndex((item) => item.id === newAnecdote.id);
			anecdotes[index] = newAnecdote;
			queryClient.setQueryData(['anecdotes'], anecdotes);
			dispatch({ type: 'VOTED', value: newAnecdote.content });
		},
		onError: (anecdoteError) => {
			console.log(anecdoteError);
			dispatch({ type: 'ERROR', value: anecdoteError.response.data.error });
		},
	});

	// const anecdotes = [
	//   {
	//     "content": "If it hurts, do it more often",
	//     "id": "47145",
	//     "votes": 0
	//   },
	// ]

	if (result.isLoading) {
		return <div>loading data...</div>;
	}

	if (result.isError) {
		return <div>anecdote service not available due to problems in server</div>;
	}

	return (
		<div>
			<h3>Anecdote app</h3>

			<Notification />
			<AnecdoteForm newAnecdoteMutation={newAnecdoteMutation} />

			{anecdotes.map((anecdote) => (
				<div key={anecdote.id}>
					<div>{anecdote.content}</div>
					<div>
						has {anecdote.votes}
						<button onClick={() => handleVote.mutate(anecdote)}>vote</button>
					</div>
				</div>
			))}
		</div>
	);
};

export default App;
