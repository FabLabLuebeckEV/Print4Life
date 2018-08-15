import { User } from '../models/user.model';

function signUp (user) {
  const newUser = new User({
    ...user
  });
  return newUser.save();
}

export default {
  signUp
};
