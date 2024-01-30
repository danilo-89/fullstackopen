import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

// Services
import loginService from './services/login';

// Page
import Home from './views/Home';
import Users from './views/Users';
import User from './views/User';
import Blog from './views/Blog';

// Components
import Login from './components/Login';
import Menu from './components/Menu';
import Notification from './components/Notification';

// Reducers
import { setUser } from './reducers/userReducer';
import { setNotification } from './reducers/notificationReducer';

// Styles
import './App.css';

const App = () => {
	const dispatch = useDispatch();

	const user = useSelector((state) => state.user);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState(null);

	const handleLogin = async (event) => {
		event.preventDefault();

		try {
			const user = await loginService.login({
				username,
				password,
			});
			dispatch(setUser(user));
			setUsername('');
			setPassword('');
			window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user));
			dispatch(
				setNotification({ message: 'User logged in', status: 'success' })
			);
		} catch (exception) {
			console.error(exception);
			setErrorMessage('Wrong credentials');
			dispatch(
				setNotification({
					message: 'Wrong username or password',
					status: 'error',
				})
			);
		}
	};

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON);
			dispatch(setUser(user));
		}
	}, []);

	return (
		<>
			<Menu />
			<div className='pt-20 px-2.5'>
				<Notification />
				{user ? null : (
					<Login
						username={username}
						setUsername={setUsername}
						password={password}
						setPassword={setPassword}
						handleLogin={handleLogin}
					/>
				)}
				<Routes>
					<Route path='/blogs/:id' element={<Blog />} />
					<Route path='/users/:id' element={<User />} />
					<Route path='/users' element={<Users />} />
					<Route path='/' element={<Home />} />
				</Routes>
			</div>
		</>
	);
};

export default App;
