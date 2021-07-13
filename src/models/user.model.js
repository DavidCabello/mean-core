const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;


const userSchema = new Schema({
  agency_id: Schema.Types.ObjectId,
  permissions_id: Schema.Types.ObjectId,
  email: {type: String, required: true},
  password: {type: String, required: true},
  pro_expiration: Date,
  admin: {type: Boolean, default: false},
  verified: {type: Boolean, default: false},
  name: String,
  phone: String,
  properties_saved: Schema.Types.Mixed
}, {timestamps: true});

userSchema.methods.hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

userSchema.methods.isValidPassword = async (password, user) => {
  return await bcrypt.compare(password, user.password);
};

userSchema.path('email').validate( async (value) => {
  const emailCount = await mongoose.models.user.countDocuments({email: value});
  return !emailCount;
}, 'Email already exists');

module.exports = mongoose.model('user', userSchema);