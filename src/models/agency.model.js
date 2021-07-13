const mongoose = require('mongoose');
const { Schema } = mongoose;

const AgencySchema = new Schema({
    name: String,
    logo_url: String
}, {timestamps: true});

module.exports = mongoose.model('agency', AgencySchema);