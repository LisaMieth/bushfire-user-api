import mongoose from 'mongoose';

export default const User = mongoose.model('User', {
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true,
  },
  importantOnly: {
    type: Boolean,
    default: false,
  },
});
