import * as jwt from 'jsonwebtoken';
import { isNumber } from 'util';
import { User } from '../models/user.model';
import { Role, roleSchema } from '../models/role.model';
import config from '../config/config';
/* eslint-disable no-unused-vars */
import emailService, { EmailOptions } from '../services/email.service';
import { ErrorType } from '../services/router.service';
import logger from '../logger';

/* eslint-enable no-unused-vars */

async function signUp (user) {
  delete user._id;
  delete user.__v;
  user.createdAt = new Date();
  const newUser = new User({
    ...user
  });
  const role = new Role();
  if (user.role) {
    role.role = user.role.role;
  }
  newUser.role = role;
  newUser.activated = user.activated || false;
  newUser.preferredLanguage = newUser.preferredLanguage || 'en';
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

function login (user, password): Promise<Object> {
  return new Promise((resolve, reject) => user.comparePassword(password, (err, isMatch) => {
    if (isMatch && !err && user.activated) {
      const signObj = {
        _id: user._id,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        address: user.address ? user.address.toJSON() : undefined,
        password: user.password,
        role: user.role.toJSON(),
        createdAt: user.createdAt
      };
      const token = jwt.sign(signObj, config.jwtSecret, { expiresIn: config.jwtExpiryTime });
      resolve({ success: true, token: `JWT ${token}` });
    } else if (!user.activated) {
      reject(
        {
          type: ErrorType.USER_DEACTIVATED,
          success: false,
          data: { userId: user._id },
          msg: 'Your account is not activated.'
        });
    } else {
      reject({ success: false, msg: 'Authentication failed. Wrong password.' });
    }
  }));
}

async function getUserByUsername (username) {
  return User.findOne({ username });
}

async function getUserById (id) {
  return User.findById(id);
}

async function getUserByToken (token) {
  const decoded = await jwt.verify(token, config.jwtSecret);
  return getUserById(decoded._id);
}

function informAdmins (user, newUser: boolean) {
  let options: EmailOptions;
  if (!user.activated) {
    options = {
      preferredLanguage: '',
      template: 'activateNewUser',
      to: '',
      locals:
      {
        adminName: '',
        userName: `${user.firstname} ${user.lastname}`,
        userEmail: user.email,
        id: user._id,
        url: `${config.baseUrlFrontend}/users/edit/${user._id}`,
        newUser
      }
    };
    User.find({ 'role.role': 'admin', activated: true }).then((admins) => {
      admins.forEach((admin) => {
        options.to = admin.email;
        options.preferredLanguage = admin.preferredLanguage || 'en';
        options.locals.adminName = `${admin.firstname} ${admin.lastname}`;
        emailService.sendMail(options);
      });
    });
  }
}

function getUsers (query?: any, limit?: any, skip?: any) {
  let l: Number;
  let s: Number;
  let promise;
  if ((limit && skip) || (isNumber(limit) && isNumber(skip))) {
    l = Number.parseInt(limit, 10);
    s = Number.parseInt(skip, 10);
    query ? promise = User.find(query).limit(l).skip(s) : promise = User.find(query).limit(l).skip(s);
  } else {
    query ? promise = User.find(query) : promise = User.find();
  }
  return promise;
}

function count (query) {
  return User.countDocuments(query);
}

async function updateUser (user) {
  delete user.__v;
  if (!user.createdAt) {
    user.createdAt = new Date();
  }
  return User.update(
    { _id: user._id },
    user,
    { upsert: true }).then(() => User.findOne({ _id: user._id }));
}

async function deleteUser (_id) {
  const user = await getUserById(_id);
  user.activated = false;
  return updateUser(user);
}

async function changePassword (user, newPassword) {
  user.password = newPassword;
  return user.save(user);
}

async function resetPassword (email: string) {
  const users = await getUsers({ email }, 1, 0);
  let password;
  let user;
  if (users && users.length === 1) {
    user = users[0];
    user.password = `${Math.random().toString(36).substring(2, 15)}`;
    password = user.password;
    try {
      await user.save();
      const options = {
        preferredLanguage: user.preferredLanguage ? user.preferredLanguage : 'en',
        template: 'resetPassword',
        to: user.email,
        locals:
        {
          userName: `${user.firstname} ${user.lastname}`,
          password,
          url: `${config.baseUrlFrontend}/`
        }
      };
      emailService.sendMail(options);
      return true;
    } catch (err) {
      logger.error(err.message);
      return false;
    }
  }
  return false;
}

export default {
  signUp,
  informAdmins,
  getRoles,
  login,
  getUserByUsername,
  getUserById,
  getUserByToken,
  getUsers,
  count,
  updateUser,
  deleteUser,
  resetPassword,
  changePassword
};
