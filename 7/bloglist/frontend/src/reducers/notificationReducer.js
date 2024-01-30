import { createSlice } from '@reduxjs/toolkit';

const initialState = null;

const notificationReducer = createSlice({
	name: 'notification',
	initialState,
	reducers: {
		showNotification(state, action) {
			const content = action.payload;
			return content;
		},
		clearNotification() {
			return null;
		},
	},
});

export const { showNotification, clearNotification } =
	notificationReducer.actions;

export const setNotification =
	(content, seconds = 5) =>
	async (dispatch) => {
		dispatch(showNotification(content));
		await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
		dispatch(clearNotification());
	};

export default notificationReducer.reducer;
