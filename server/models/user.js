import mongoose, { Schema } from 'mongoose';
import validator from 'validator';
import jwt from 'jsonwebtoken';

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  tokens: [{
    access: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
  }],
  suburb: {
    type: String,
    required: true,
    minlength: 5,
  },
  state: {
    type: String,
    required: true,
  },
  importantOnly: {
    type: Boolean,
    default: false,
  },
});

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  return { _id: userObject._id, email: userObject.email };
};

UserSchema.methods.generateAuthToken = function () {
  // Individual document
  const user = this;
  const access = 'auth';
  const token = jwt.sign({ _id: user._id.toHexString(), access }, 'abc123').toString();

  user.tokens.push({ access, token });
  return user.save().then(() => token);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
