const mongoose = require('mongoose');

const SiteSchema = mongoose.Schema({
    name: String,
    uniqueName: String,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    host: Boolean
});

module.exports = mongoose.model('site', SiteSchema);