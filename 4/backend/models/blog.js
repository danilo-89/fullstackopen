const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
	title: {
		type: String,
		required: [true, 'field required'],
	},
	author: String,
	url: {
		type: String,
		required: [true, 'field required'],
	},
	likes: {
		type: Number,
		default: 0,
	},
});

// number: {
// 	type: String,
// 	minLength: 8,
// 	validate: {
// 		validator: function (v) {
// 			return /^\d{2,3}-\d+$/.test(v);
// 		},
// 		message: (props) => `${props.value} is not a valid phone number!`,
// 	},
// 	required: [true, 'Person phone number required'],
// },

blogSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

module.exports = mongoose.model('Blog', blogSchema);
