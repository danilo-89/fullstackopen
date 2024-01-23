import { createContext, useReducer, useContext, useEffect } from 'react';

const actionTypes = {
	CREATED: 'CREATED',
	VOTED: 'VOTED',
	ERROR: 'ERROR',
	CLEAR: 'CLEAR',
};

const notificationReducer = (state, action) => {
	switch (action.type) {
		case actionTypes.CREATED:
			return `anecdote '${action.value}' created`;
		case actionTypes.VOTED:
			return `anecdote '${action.value}' voted`;
		case actionTypes.ERROR:
			return action.value;
		case actionTypes.CLEAR:
			return undefined;
		default:
			return state;
	}
};

const NotificationContext = createContext();

export const NotificationContextProvider = (props) => {
	const [notification, notificationDispatch] = useReducer(
		notificationReducer,
		undefined
	);

	// clear notification after 5 seconds
	useEffect(() => {
		let to = null;
		if (notification) {
			to = setTimeout(() => {
				notificationDispatch({ type: 'CLEAR' });
			}, 5000);
		}

		return () => {
			if (to) clearTimeout(to);
		};
	}, [notification]);

	return (
		<NotificationContext.Provider value={[notification, notificationDispatch]}>
			{props.children}
		</NotificationContext.Provider>
	);
};

export const useNotificationValue = () => {
	const notificationAndDispatch = useContext(NotificationContext);
	return notificationAndDispatch[0];
};

export const useNotificationDispatch = () => {
	const notificationAndDispatch = useContext(NotificationContext);
	return notificationAndDispatch[1];
};

export default NotificationContext;
