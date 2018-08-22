import { User } from '../models/user.model';
import { Role, roleSchema } from '../models/role.model';

async function signUp (user) {
  delete user._id;
  delete user.__v;
  const newUser = new User({
    ...user
  });
  const role = new Role({ role: user.role });
  newUser.role = role;
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
