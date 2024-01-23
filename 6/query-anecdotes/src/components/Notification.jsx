import { useNotificationValue } from '../context/NotificationContext';

const style = {
	border: 'solid',
	padding: 10,
	borderWidth: 1,
	marginBottom: 5,
};

const Notification = () => {
	const value = useNotificationValue();

	if (!value) return null;

	return <div style={style}>{value}</div>;
};

export default Notification;
