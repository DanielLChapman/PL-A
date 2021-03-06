const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');
const crypto = require('crypto');

const playlistSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		required: 'Please enter a name'
	},
	slug: String,
	description: {
		type: String,
		trim: true,
		default: 'No Description Given'
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
	}],
	salt: String,
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

	if (this.salt == null) {
		this.salt = crypto.randomBytes(16).toString('hex');
	}
	if (this.isModified('password')) {
		this.password = crypto.pbkdf2Sync(this.password, this.salt, 10000, 256, 'sha').toString('hex');
	}
	if (this.isModified('editPassword')) {
		this.editPassword = crypto.pbkdf2Sync(this.editPassword, this.salt, 10000, 256, 'sha').toString('hex');
	}
	next();
});

module.exports = mongoose.model('Playlist', playlistSchema);
