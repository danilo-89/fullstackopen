const _ = require('lodash');

// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
	return 1;
};

const totalLikes = (blogs) => {
	return blogs.reduce((acc, blog) => acc + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
	// Check if blogs is an array and has at least one item
	if (!Array.isArray(blogs) || blogs.length === 0) {
		return undefined;
	}

	return blogs.reduce(
		(acc, blog) => (acc?.likes && acc?.likes > blog.likes ? acc : blog),
		undefined
	);
};

const mostBlogs = (blogs) => {
	// Check if blogs is an array and has at least one item
	if (!Array.isArray(blogs) || blogs.length === 0) {
		return undefined;
	}

	// Count the number of blogs per author
	const blogCounts = _.countBy(blogs, 'author');

	// Find the author with the maximum number of blogs
	const topAuthor = _.maxBy(
		Object.keys(blogCounts),
		(author) => blogCounts[author]
	);

	// Return the result
	return {
		author: topAuthor,
		blogs: blogCounts[topAuthor],
	};
};

const mostLikes = (blogs) => {
	// Check if blogs is an array and has at least one item
	if (!Array.isArray(blogs) || blogs.length === 0) {
		return undefined;
	}

	// Calculate the total likes per author
	const likesPerAuthor = blogs.reduce((acc, blog) => {
		acc[blog.author] = (acc[blog.author] || 0) + blog.likes;
		return acc;
	}, {});

	// Find the author with the maximum total likes
	const topAuthor = _.maxBy(
		Object.keys(likesPerAuthor),
		(author) => likesPerAuthor[author]
	);

	return {
		author: topAuthor,
		likes: likesPerAuthor[topAuthor],
	};
};

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog,
	mostBlogs,
	mostLikes,
};
