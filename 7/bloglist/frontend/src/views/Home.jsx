import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Services
import loginService from '../services/login';
import blogService from '../services/blogs';

// Components
import Blog from '../components/Blog';
import CreateBlog from '../components/CreateBlog';
import Togglable from '../components/Togglable';

// Reducers
import { setUser } from '../reducers/userReducer';
import { setNotification } from '../reducers/notificationReducer';
import {
	initializeBlogs,
	createBlog as createNew,
	likeBlog,
	removeBlog,
} from '../reducers/blogReducer';

const Home = () => {
	const dispatch = useDispatch();
	const blogs = useSelector((state) => state.blog);
	const user = useSelector((state) => state.user);

	console.log({ user });

	const [_, setBlogs] = useState([]);

	useEffect(() => {
		dispatch(initializeBlogs());
	}, []);

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const [errorMessage, setErrorMessage] = useState(null);
	const togglableRef = useRef();

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

	const handleCreateBlog = async (data) => {
		console.log(user.token, data);
		await dispatch(createNew(user.token, data));
		togglableRef.current.toggleVisibility();
	};

	const handleDeleteBlog = async (blog) => {
		console.log(blog);
		const isConfirmed = confirm(`Remove blog ${blog.title} by ${blog.author}`);
		if (isConfirmed) {
			dispatch(removeBlog(user.token, blog.id));
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

		dispatch(likeBlog(user.token, data, id));
	};

	useEffect(() => {
		const fetchData = async () => {
			const response = await blogService.getAll();
			const blogsSorted = response.sort((a, b) => b.likes - a.likes);
			setBlogs(blogsSorted);
		};

		fetchData();
	}, []);

	return (
		<div>
			{
				user ? (
					<div>
						<div>
							<Togglable
								buttonLabel='new blog'
								ref={togglableRef}
								className='border p-2 bg-purple-50 mb-4'
							>
								<CreateBlog handleCreateBlog={handleCreateBlog} />
							</Togglable>
						</div>
						<div className='blogs-list'>
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
				) : null
				// <Login
				// 	username={username}
				// 	setUsername={setUsername}
				// 	password={password}
				// 	setPassword={setPassword}
				// 	handleLogin={handleLogin}
				// />
			}
		</div>
	);
};

export default Home;
