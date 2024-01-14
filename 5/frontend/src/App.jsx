import { useState, useEffect, useRef } from 'react';

// Services
import loginService from './services/login';
import blogService from './services/blogs';

// Components
import Blog from './components/Blog';
import Login from './components/Login';
import CreateBlog from './components/CreateBlog';
import Notification from './components/Notification';
import Togglable from './components/Togglable';

// Styles
import './App.css';

const App = () => {
	const [blogs, setBlogs] = useState([]);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [user, setUser] = useState(null);
	const [errorMessage, setErrorMessage] = useState(null);
	const [notification, setNotification] = useState(null);
	const togglableRef = useRef();

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

	const handleCreateBlog = async (data) => {
		try {
			const postResponse = await blogService.createNew(user.token, data);
			console.log(postResponse);

			if (postResponse.status === 201) {
				setBlogs((curr) => [
					...curr,
					{
						...postResponse.data,
						user: { name: user.name, username: user.username },
					},
				]);
				setNotification({
					message: `Blog created successfully: ${postResponse.data.title} ${postResponse.data.author}`,
					status: 'success',
				});
				togglableRef.current.toggleVisibility();
			}
		} catch (error) {
			setNotification({
				message: error?.response?.data?.error || error?.message,
				status: 'error',
			});
		}
	};

	const handleDeleteBlog = async (blog) => {
		console.log(blog);
		const isConfirmed = confirm(`Remove blog ${blog.title} by ${blog.author}`);
		if (isConfirmed) {
		}
	};

	const handleLikeBlog = async (blog) => {
		console.log(blog);
		const isConfirmed = confirm(`Remove blog ${blog.title} by ${blog.author}`);
		if (isConfirmed) {
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
						<Togglable buttonLabel='new note' ref={togglableRef}>
							<CreateBlog createNewBlog={handleCreateBlog} />
						</Togglable>
					</div>
					<div>
						<h2>blogs</h2>
						{blogs.map((blog) => (
							<Blog
								key={blog.id}
								blog={blog}
								handleDeleteBlog={handleDeleteBlog}
							/>
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
