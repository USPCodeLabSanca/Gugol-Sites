const mongoose = require('mongoose');

const SiteSchema = mongoose.Schema({
    name: {type: String, required: true},
    uniqueName: {type: String, unique: true, required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
    host: {type: Boolean, required: true}
});

module.exports = mongoose.model('site', SiteSchema);