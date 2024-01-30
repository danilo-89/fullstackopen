import { useSelector } from 'react-redux';
import clsx from 'clsx';

const Notification = () => {
	const notification = useSelector((state) => state.notification);

	if (notification)
		return (
			<div
				className={clsx(
					notification?.status || 'success',
					'fixed right-3 top-5'
				)}
			>
				{notification?.message}
			</div>
		);

	return null;
};

export default Notification;
