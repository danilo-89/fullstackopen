import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { setUser } from '../reducers/userReducer';

const Menu = () => {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user);

	return (
		<nav className='absolute bg-violet-300 w-full p-3'>
			<ul className='flex gap-2 items-center'>
				<li>
					<Link to='/'>blogs</Link>
				</li>
				<li>
					<Link to='/users'>users</Link>
				</li>
				{user ? (
					<li className='ml-auto'>
						<span className='mr-2'>{user?.name} logged in</span>
						<button
							type='button'
							onClick={() => {
								dispatch(setUser(null));
								setUsername('');
								setPassword('');
								window.localStorage.removeItem('loggedBlogAppUser');
							}}
						>
							logout
						</button>
					</li>
				) : null}
			</ul>
		</nav>
	);
};

export default Menu;
