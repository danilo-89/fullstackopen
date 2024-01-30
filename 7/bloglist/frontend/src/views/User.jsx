import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// Services
import usersService from '../services/users';

// Components
import Comments from '../components/Comments';

const User = () => {
	const id = useParams().id;
	const [data, setData] = useState(null);

	console.log({ id });
	console.log(data);

	useEffect(() => {
		const fetchData = async () => {
			const response = await usersService.getUser(id);
			setData(response);
		};

		fetchData();
	}, []);

	if (!data) {
		return null;
	}

	return (
		<div>
			<h2>{data.name || data.username}</h2>
			<h3>added blogs</h3>
			<ul>
				{data.blogs.map((item) => (
					<li key={item.id}>
						<Link to={`/blogs/${item.id}`}>{item.title}</Link>
					</li>
				))}
			</ul>
		</div>
	);
};

export default User;
