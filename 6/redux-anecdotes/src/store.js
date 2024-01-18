import { configureStore } from '@reduxjs/toolkit';

// Reducers
import anecdoteReducer from './reducers/anecdoteReducer';
import filterReducer from './reducers/filterReducer';
import notificationReducer from './reducers/notificationReducer';

// store object structure:
// {
//   anecdotes: ... ,
//   filter: ...
//   notification: ...
// }
const store = configureStore({
	reducer: {
		anecdotes: anecdoteReducer,
		filter: filterReducer,
		notification: notificationReducer,
	},
});

export default store;
