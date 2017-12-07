const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');


const playlistSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		required: 'Please enter a name'
	},
	slug: String,
	description: {
		type: String,
		trim: true
	},
	views: {
		type: Number,
		default: 0
	},
	videos: [{
		videoID: String,
		site: String,
		order: Number
	}],
	//owner
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User'
	},
	private: {
		type: Boolean,
		default: false
	},
	password: String,
	sharedEdit: {
		type: Boolean,
		default: false
	},
	editPassword: String,
	tags: [{
		type: String,
		trim: true
	}]
}, {
  timestamps: true
});

playlistSchema.index({
	name: 'text',
	description: 'text',
	slug: 'text',
	tags: 'text'
});

playlistSchema.pre('save', async function(next) {
	if (!this.isModified('name')) {
		next();
		return;
	}
	this.slug = slug(this.name);
	//Check for other Playlists
	const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
	const playlistsWithSlug = await this.constructor.find({slug: slugRegEx });
	if (playlistsWithSlug.length) {
		this.slug = `${this.slug}-${playlistsWithSlug.length+1}`;
	}
	next();
});

module.exports = mongoose.model('Playlist', playlistSchema);
