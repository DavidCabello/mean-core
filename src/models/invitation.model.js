const mongoose = require('mongoose');
const { Schema } = mongoose;

const InvitationSchema = new Schema({
    agency_id: Schema.Types.ObjectId,
    permissions_id: Schema.Types.ObjectId,
    email: String,
    sender: String
});

module.exports = mongoose.model('invitation', InvitationSchema);