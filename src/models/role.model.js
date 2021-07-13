const mongoose = require('mongoose');
const { Schema } = mongoose;

const RoleSchema = new Schema({
    agency_id: Schema.Types.ObjectId,
    name: String,
    default: {type: Boolean, default: false},
    create_property: {type: Boolean, default: true},
    edit_properties: {type: Boolean, default: false},
    delete_properties: {type: Boolean, default: false},
    invite_agent: {type: Boolean, default: false},
    remove_agent: {type: Boolean, default: false},
    manage_roles: {type: Boolean, default: false},
    agency_stats: {type: Boolean, default: false},
    agency_activity: {type: Boolean, default: false},
    agency_info: {type: Boolean, default: false}
});

module.exports = mongoose.model('role', RoleSchema);