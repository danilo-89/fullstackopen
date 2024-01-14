import { useState } from 'react';

const blogStyle = {
	paddingTop: 10,
	paddingLeft: 2,
	border: 'solid',
	borderWidth: 1,
	marginBottom: 5,
};

const Blog = ({ blog, handleDeleteBlog }) => {
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<div style={blogStyle}>
			{blog.title} {blog.author}
			<button type='button' onClick={() => setIsExpanded((curr) => !curr)}>
				{isExpanded ? 'hide' : 'show'}
			</button>
			{isExpanded ? (
				<div>
					<div>{blog.url}</div>
					<div>
						likes {blog.likes} <button type='button'>like</button>
					</div>
					<div>{blog.user.name}</div>
					<div>
						<button type='button' onClick={() => handleDeleteBlog(blog)}>
							remove
						</button>
					</div>
				</div>
			) : null}
		</div>
	);
};

export default Blog;
