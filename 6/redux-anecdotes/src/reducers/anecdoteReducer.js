import { createSlice } from '@reduxjs/toolkit';

import { getAll, createNew, vote } from '../services/anecdotes';

// Reducers
import { setNotification } from './notificationReducer';

const initialState = [];

const anecdoteSlice = createSlice({
	name: 'anecdotes',
	initialState,
	reducers: {
		appendAnecdote(state, action) {
			state.push(action.payload);
		},
		setVote(state, action) {
			const id = action.payload.id;
			const changedAnecdote = {
				...action.payload,
			};
			return state.map((item) => (item.id === id ? changedAnecdote : item));
		},
		setAnecdotes(state, action) {
			return action.payload;
		},
	},
	// 		// another way
	// extraReducers: (builder) => {
	// 	builder.addCase(createAnecdoteAsync.fulfilled, (state, action) => {
	// 		// Handle the fulfilled state, append the anecdote, and set a notification
	// 		state.push(action.payload);
	// 		// You would need to handle the notification state update here as well
	// 	});
	// 	builder.addCase(createAnecdoteAsync.rejected, (state, action) => {
	// 		// Handle the rejected state, potentially set a notification for the error
	// 	});
	// }
});

export const { appendAnecdote, setVote, setAnecdotes } = anecdoteSlice.actions;

export const initializeAnecdotes = () => {
	return async (dispatch) => {
		const anecdotes = await getAll();
		dispatch(setAnecdotes(anecdotes));
	};
};

export const createAnecdote = (content) => {
	return async (dispatch) => {
		try {
			const newAnecdote = await createNew(content);
			dispatch(appendAnecdote(newAnecdote));
			dispatch(setNotification(`you created '${content}'`));
		} catch (error) {
			console.log(error);
			dispatch(setNotification('Error creating anecdote'));
		}
	};
};

export const voteAnecdote = (item) => {
	return async (dispatch) => {
		try {
			const newAnecdote = await vote(item);

			console.log(newAnecdote);
			dispatch(setVote(newAnecdote));
			dispatch(setNotification(`you voted '${item.content}'`, 10));
		} catch (error) {
			console.log(error);
			dispatch(setNotification('Error voting anecdote'));
		}
	};
};

// another way
// const createAnecdoteAsync = createAsyncThunk(
//   'anecdotes/createNew',
//   async (content, { rejectWithValue }) => {
//     try {
//       const response = await createNew(content);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

export default anecdoteSlice.reducer;
