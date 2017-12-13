const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const md5 = require('md5');


const apiSchema = new Schema({
	apiKey: {
		type: String,
		required: 'No point in logging without one'
	},
	ipAddress: {
		type: String,
		required: 'No point in logging without one'
	},
	action: String,
	name: String,
	userAgent: String
}, {
  timestamps: true
});


module.exports = mongoose.model('API', apiSchema);
