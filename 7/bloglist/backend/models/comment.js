const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
	content: {
		type: String,
		required: [true, 'field required'],
	},
	blog: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Blog',
		required: [true, 'field required'],
	},
});

commentSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

module.exports = mongoose.model('Comment', commentSchema);
