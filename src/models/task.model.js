const mongoose = require('mongoose');
const { Schema } = mongoose;

const TaskSchema = new Schema({
    user_id: {type: Schema.Types.ObjectId, required: true},
    client_id: String,//Schema.Types.ObjectId,
    properties_ids: [String],
    title: String,
    description: String,
    date: {type: Date, required: true},
    reminder: Boolean,
    notify: Schema.Types.Mixed,
    action: {type: String, default: 'custom'},
    done: {type: Boolean, default: false},
    canceled: {type: Boolean, default: false},
    enabled: {type: Boolean, default: true}
}, {timestamps: true});

module.exports = mongoose.model('task', TaskSchema);