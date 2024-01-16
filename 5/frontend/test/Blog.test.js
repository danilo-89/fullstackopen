import React from 'react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';

// Helpers
import { blogDataMocked } from './testHelpers';

// Components
import Blog from '../src/components/Blog';

const showRemove = false;

test('renders content', () => {
	const { container } = render(
		<Blog
			blog={blogDataMocked}
			handleDeleteBlog={() => null}
			handleLikeBlog={() => null}
			showRemove={showRemove}
		/>
	);

	const div = container.querySelector('.blog-65a1000b2496f523ae966c5a');
	expect(div).toHaveTextContent('Lorem title Lorem author');
	expect(div).not.toHaveTextContent('http://lorem-ipsum.lor');
	expect(div).not.toHaveTextContent('likes 5');
	expect(div).not.toHaveTextContent('Tom Tester');
});

test("clicking the button shows the blog's URL and number of likes", async () => {
	const { container } = render(
		<Blog
			blog={blogDataMocked}
			handleDeleteBlog={() => null}
			handleLikeBlog={() => null}
			showRemove={showRemove}
		/>
	);

	const user = userEvent.setup();
	const button = screen.getByText('show');
	await user.click(button);

	const div = container.querySelector('.blog-65a1000b2496f523ae966c5a');
	expect(div).toHaveTextContent('http://lorem-ipsum.lor');
	expect(div).toHaveTextContent('likes 5');
});

test('ensures that if the like button is clicked twice, the event handler the component received as props is called twice', async () => {
	const handleLikeBlog = jest.fn();

	render(
		<Blog
			blog={blogDataMocked}
			handleDeleteBlog={() => null}
			handleLikeBlog={handleLikeBlog}
			showRemove={showRemove}
		/>
	);

	const user = userEvent.setup();
	const buttonShow = screen.getByText('show');
	await user.click(buttonShow);
	const buttonLike = screen.getByText('like');
	await user.click(buttonLike);
	await user.click(buttonLike);

	expect(handleLikeBlog.mock.calls).toHaveLength(2);
});
