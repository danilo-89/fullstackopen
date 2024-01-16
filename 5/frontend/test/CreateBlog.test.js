import React from 'react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';

// Helpers
import { blogDataMocked } from './testHelpers';

// Components
import CreateBlog from '../src/components/CreateBlog';

test('ensure that the form calls the event handler it received as props with the right details when a new blog is created', async () => {
	const handleCreateBlog = jest.fn();
	const user = userEvent.setup();

	const { container } = render(
		<CreateBlog handleCreateBlog={handleCreateBlog} />
	);

	const titleInput = container.querySelector(`input[name="title"]`);
	const authorInput = container.querySelector(`input[name="author"]`);
	const urlInput = container.querySelector(`input[name="url"]`);

	await user.type(titleInput, blogDataMocked.title);
	await user.type(authorInput, blogDataMocked.author);
	await user.type(urlInput, blogDataMocked.url);

	const button = screen.getByText('create');
	await user.click(button);

	expect(handleCreateBlog.mock.calls[0][0]).toEqual({
		title: blogDataMocked.title,
		author: blogDataMocked.author,
		url: blogDataMocked.url,
	});
});
