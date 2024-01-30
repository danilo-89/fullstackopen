import { createSlice } from '@reduxjs/toolkit';

// Services
import blogsServices from '../services/blogs';

// Reducers
import { setNotification } from './notificationReducer';

const initialState = [];

const blogReducer = createSlice({
	name: 'blog',
	initialState,
	reducers: {
		setBlogs(state, action) {
			return action.payload;
		},
		appendBlog(state, action) {
			state.push(action.payload);
		},
		replaceBlog(state, action) {
			console.log(action.payload);
			const id = action.payload.id;
			const blogIndex = state.findIndex((item) => item.id === id);
			if (blogIndex > -1) {
				state[blogIndex] = action.payload;
			} else {
				return state;
			}
		},
		deleteBlog(state, action) {
			const id = action.payload;
			const blogIndex = state.findIndex((item) => item.id === id);
			if (blogIndex > -1) {
				state.splice(blogIndex, 1);
			}
		},
	},
});

export const { setBlogs, appendBlog, replaceBlog, deleteBlog } =
	blogReducer.actions;

export const initializeBlogs = () => {
	return async (dispatch) => {
		const blogs = await blogsServices.getAll();
		dispatch(setBlogs(blogs));
	};
};

export const createBlog = (token, content) => {
	return async (dispatch) => {
		try {
			const newBlog = await blogsServices.createBlog(token, content);
			console.log(newBlog);
			dispatch(appendBlog(newBlog.data));
			dispatch(setNotification({ message: `you created '${content.title}'` }));
		} catch (error) {
			console.log(error);
			dispatch(
				setNotification({ message: 'Error creating blog', status: 'error' })
			);
		}
	};
};

export const likeBlog = (token, data, id, queryClient) => {
	return async (dispatch) => {
		try {
			const newBlog = await blogsServices.likeBlog(token, data, id);
			console.log(newBlog);
			dispatch(replaceBlog(newBlog.data));
			dispatch(setNotification({ message: `you liked '${data.title}'` }));
			if (queryClient) {
				queryClient.invalidateQueries({
					queryKey: ['blog', id],
					refetchType: 'active',
				});
			}
		} catch (error) {
			console.log(error);
			dispatch(
				setNotification({ message: 'Error liking blog', status: 'error' })
			);
			throw new Error('Error liking blog');
		}
	};
};

export const removeBlog = (token, id) => {
	return async (dispatch) => {
		try {
			const newBlog = await blogsServices.deleteBlog(token, id);
			console.log(newBlog);
			dispatch(deleteBlog(id));
			dispatch(setNotification({ message: 'Blog deleted' }));
		} catch (error) {
			console.log(error);
			dispatch(
				setNotification({ message: 'Error deleting blog', status: 'error' })
			);
		}
	};
};

export default blogReducer.reducer;
