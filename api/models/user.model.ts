import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { addressSchema } from './address.model';
import { roleSchema } from './role.model';
import { languageSchema } from './language';

const { Schema } = { Schema: mongoose.Schema };

export const userSchema = new Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  address: addressSchema,
  role: {
    type: roleSchema,
    required: true
  },
  preferredLanguage: {
    type: languageSchema,
    required: true
  },
  activated: {
    type: Boolean,
    required: true,
    default: false
  },
  createdAt: {
    type: Date,
    required: true
  },
  fablabId: {
    type: String,
    minlength: 24,
    maxlength: 24
  },
});

/* eslint-disable */
userSchema.pre('save', function (next) {
  const user = this;
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});
/* eslint-enable */

/* eslint-disable */
userSchema.methods.comparePassword = function (passw, cb) {
  bcrypt.compare(passw, this.password, (err, isMatch) => {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};
/* eslint-enable */

export const User = mongoose.model('User', userSchema);

export default User;
