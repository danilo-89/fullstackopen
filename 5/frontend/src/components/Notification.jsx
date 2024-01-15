import { useEffect } from 'react';

const Notification = ({ notification, setNotification }) => {
	useEffect(() => {
		if (notification) {
			console.log('inside');
			setTimeout(() => {
				setNotification(null);
			}, 5000);
		}
	}, [notification, setNotification]);

	return <div className={notification?.status}>{notification?.message}</div>;
};

export default Notification;
