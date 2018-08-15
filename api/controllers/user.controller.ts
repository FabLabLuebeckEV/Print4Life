import { User } from '../models/user.model';
import { roleSchema } from '../models/role.model';

async function signUp (user) {
  const newUser = new User({
    ...user
  });
  return newUser.save();
}

async function getRoles () {
  return new Promise((resolve, reject) => {
    const roles = roleSchema.paths.role.enumValues;
    if (roles === undefined) {
      reject();
    } else {
      resolve(roles);
    }
  });
}

export default {
  signUp,
  getRoles
};
