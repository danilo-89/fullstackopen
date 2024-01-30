import { useState } from 'react';
import { Link } from 'react-router-dom';

const blogStyle = {
	paddingTop: 10,
	paddingLeft: 2,
	border: 'solid',
	borderWidth: 1,
	marginBottom: 5,
};

const Blog = ({ blog, handleDeleteBlog, handleLikeBlog, showRemove }) => {
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<div style={blogStyle} className={`blog blog-${blog.id}`}>
			<Link to={`/blogs/${blog.id}`} className='mr-2'>
				{blog.title} {blog.author}
			</Link>
			<button type='button' onClick={() => setIsExpanded((curr) => !curr)}>
				{isExpanded ? 'hide' : 'show'}
			</button>
			{isExpanded ? (
				<>
					<div>{blog.url}</div>
					<div>
						likes {blog.likes}{' '}
						<button
							type='button'
							data-cy='btn-like'
							onClick={() => {
								handleLikeBlog(blog);
							}}
						>
							like
						</button>
					</div>
					<div>{blog.user.name}</div>
					<div>
						{showRemove ? (
							<button
								type='button'
								onClick={() => handleDeleteBlog(blog)}
								data-cy='btn-delete'
							>
								remove
							</button>
						) : null}
					</div>
				</>
			) : null}
		</div>
	);
};

export default Blog;
