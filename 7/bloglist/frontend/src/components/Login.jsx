const Login = ({
	username,
	setUsername,
	password,
	setPassword,
	handleLogin,
}) => {
	return (
		<div className='mb-4'>
			<h1>log in to application</h1>
			<form onSubmit={handleLogin}>
				<div>
					<label>
						<span className='pr-2'>username</span>
						<input
							type='text'
							name='username'
							id='username'
							value={username}
							onChange={({ target }) => setUsername(target.value)}
						/>
					</label>
				</div>
				<div>
					<label>
						<span className='pr-2'>password</span>
						<input
							type='password'
							name='password'
							id='password'
							value={password}
							onChange={({ target }) => setPassword(target.value)}
						/>
					</label>
				</div>

				<button type='submit'>login</button>
			</form>
		</div>
	);
};

export default Login;
