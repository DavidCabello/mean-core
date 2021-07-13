const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotificationSchema = new Schema({
    user_id: {type: Schema.Types.ObjectId, required: true},
    type: String,
    action: String,
    client_id: Schema.Types.ObjectId,
    agent_id: Schema.Types.ObjectId,
    task_id: Schema.Types.ObjectId
}, {timestamps: true});

module.exports = mongoose.model('notification', NotificationSchema);