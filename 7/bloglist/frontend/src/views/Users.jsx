import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import usersService from '../services/users';

const Users = () => {
	const [users, setUsers] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			const response = await usersService.getAll();
			const usersSorted = response.sort(
				(a, b) => b.blogs.length - a.blogs.length
			);
			setUsers(usersSorted);
		};

		fetchData();
	}, []);

	return (
		<div>
			<h2>Users</h2>

			<div>
				<table>
					<thead>
						<tr>
							<th className='bg-slate-100'>user</th>
							<th className='bg-purple-200 p-2'>blogs created</th>
						</tr>
					</thead>
					<tbody>
						{users?.map((item) => (
							<tr key={item.id}>
								<td className='bg-slate-50 p-1 pr-2'>
									<Link to={`/users/${item.id}`}>
										{item.name ?? item.username}
									</Link>
								</td>
								<td className='bg-purple-100 p-1'>{item.blogs.length}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default Users;
