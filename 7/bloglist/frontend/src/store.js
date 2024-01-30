import { configureStore } from '@reduxjs/toolkit';

// Reducers
import notificationReducer from './reducers/notificationReducer';
import blogReducer from './reducers/blogReducer';
import userReducer from './reducers/userReducer';

// store object structure:
// {
//   user: ...
//   blog: ...
//   notification: ...
// }
const store = configureStore({
	reducer: {
		user: userReducer,
		notification: notificationReducer,
		blog: blogReducer,
	},
});

export default store;
