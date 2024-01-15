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
			const postResponse = await blogService.createBlog(user.token, data);
			console.log(postResponse);

			if (postResponse.status === 201) {
				setBlogs((curr) => [
					...curr,
					{
						...postResponse.data,
						user: {
							name: user.name,
							username: user.username,
							id: postResponse.data.user,
						},
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
			try {
				const deleteResponse = await blogService.deleteBlog(
					user.token,
					blog.id
				);
				console.log(deleteResponse);

				if (deleteResponse.status === 204) {
					setBlogs((curr) => {
						return curr.filter((item) => item.id !== blog.id);
					});
					setNotification({
						message: 'Blog deleted',
						status: 'success',
					});
				}
			} catch (error) {
				setNotification({
					message: error?.response?.data?.error || error?.message,
					status: 'error',
				});
			}
		}
	};

	const handleLikeBlog = async (blog) => {
		console.log(blog);
		const { user: _user, id, ...requiredData } = blog;

		const data = {
			...requiredData,
			likes: ++requiredData.likes,
			user: blog.user.id,
		};

		console.log(data);

		try {
			const putResponse = await blogService.likeBlog(user.token, data, id);

			console.log(putResponse);

			if (putResponse.status === 200) {
				setBlogs((curr) => {
					const blogIndex = curr.findIndex((item) => item.id === id);
					if (blogIndex > -1) {
						const newData = [...curr];
						newData[blogIndex].likes = putResponse.data.likes;
						return newData;
					}
				});
				setNotification({
					message: 'Blog likes updated',
					status: 'success',
				});
			}
		} catch (error) {
			setNotification({
				message: error?.response?.data?.error || error?.message,
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
						<Togglable buttonLabel='new note' ref={togglableRef}>
							<CreateBlog handleCreateBlog={handleCreateBlog} />
						</Togglable>
					</div>
					<div>
						<h2>blogs</h2>
						{blogs.map((blog) => (
							<Blog
								key={blog.id}
								blog={blog}
								handleDeleteBlog={handleDeleteBlog}
								handleLikeBlog={handleLikeBlog}
								showRemove={user.username === blog.user.username}
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
