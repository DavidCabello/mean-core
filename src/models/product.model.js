const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
  userID: {type: Schema.Types.ObjectId, required: true},
  name: String,
  description: String
}, {timestamps: true});

module.exports = mongoose.model('product', productSchema);