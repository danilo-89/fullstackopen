import { useState, useEffect } from 'react';

// Services
import loginService from './services/login';
import blogService from './services/blogs';

// Components
import Blog from './components/Blog';
import Login from './components/Login';
import CreateBlog from './components/CreateBlog';
import Notification from './components/Notification';

// Styles
import './App.css';

const App = () => {
	const [blogs, setBlogs] = useState([]);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [user, setUser] = useState(null);
	const [errorMessage, setErrorMessage] = useState(null);
	const [notification, setNotification] = useState(null);

	const handleLogin = async (event) => {
		event.preventDefault();

		try {
			const user = await loginService.login({
				username,
				password,
			});
			setUser(user);
			setUsername('');
			setPassword('');
			window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user));
			setNotification({ message: 'User logged in', status: 'success' });
		} catch (exception) {
			console.error(exception);
			setErrorMessage('Wrong credentials');
			setNotification({
				message: 'Wrong username or password',
				status: 'error',
			});
		}
	};

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON);
			setUser(user);
		}
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			const response = await blogService.getAll();
			setBlogs(response);
		};

		fetchData();
	}, []);

	return (
		<div>
			{notification ? (
				<Notification
					notification={notification}
					setNotification={setNotification}
				/>
			) : null}
			{user ? (
				<div>
					<div>{user.name} logged in</div>
					<button
						type='button'
						onClick={() => {
							setUser(null);
							setUsername('');
							setPassword('');
							window.localStorage.removeItem('loggedBlogAppUser');
						}}
					>
						logout
					</button>
					<div>
						<CreateBlog
							user={user}
							setBlogs={setBlogs}
							setNotification={setNotification}
						/>
					</div>
					<div>
						<h2>blogs</h2>
						{blogs.map((blog) => (
							<Blog key={blog.id} blog={blog} />
						))}
					</div>
				</div>
			) : (
				<Login
					username={username}
					setUsername={setUsername}
					password={password}
					setPassword={setPassword}
					handleLogin={handleLogin}
				/>
			)}
		</div>
	);
};

export default App;
