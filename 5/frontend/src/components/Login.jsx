const Login = ({
	username,
	setUsername,
	password,
	setPassword,
	handleLogin,
}) => {
	return (
		<div>
			<h1>log in to application</h1>
			<form onSubmit={handleLogin}>
				<div>
					<label htmlFor=''>
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
					<label htmlFor=''>
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
