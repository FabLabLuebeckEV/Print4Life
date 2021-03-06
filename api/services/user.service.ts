import * as jwt from 'jsonwebtoken';
import { isNumber } from 'util';
import { User } from '../models/user.model';
import { Role, roleSchema } from '../models/role.model';
import config from '../config/config';
/* eslint-disable no-unused-vars */
import emailService, { EmailOptions } from '../services/email.service';
import Language, { languageSchema } from '../models/language';
import { ErrorType, IError } from '../services/router.service';
import logger from '../logger';
import ModelService from './model.service';
import Fablab from '../models/fablab.model';
import HospitalService from '../services/hospital.service';
/* eslint-enable no-unused-vars */

const hospitalService = new HospitalService();

export class UserService implements ModelService {
  /* eslint-disable class-methods-use-this */
  /**
   * This method creates a new user
   * @param user are the params for the 3d printer
   * @returns a promise with the results
   */
  public async create (user) {
    delete user._id;
    delete user.__v;
    if (!user.preferredLanguage) {
      const language = new Language();
      user.preferredLanguage = language;
    }
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
    return newUser.save();
  }

  /**
     * This method gets all possible roles for users
     * @returns a promise with the result
     */
  public async getRoles () {
    return new Promise((resolve, reject) => {
      const roles = roleSchema.paths.role.enumValues;
      if (roles === undefined) {
        reject();
      } else {
        resolve(roles);
      }
    });
  }

  /**
     * This method gets all available languages for users
     * @returns a promise with the result
     */
  public async getLanguages () {
    return new Promise((resolve, reject) => {
      const langs = languageSchema.paths.language.enumValues;
      if (langs === undefined) {
        reject();
      } else {
        resolve(langs);
      }
    });
  }

  /**
     * This method logs in a user
     * @param user is the username
     * @param password is the password
     * @return a promise with the result
     */
  public login (user, password): Promise<Object> {
    let error: IError;

    return new Promise((resolve, reject) => user.comparePassword(password, (err, isMatch) => {
      hospitalService.getAll({
        owner: user._id
      }).then((hospitals) => {
        let hospitalValid = true;
        if (user.role.role === 'user') {
          if (hospitals.length !== 1) {
            error = {
              name: 'MALFORMED_ACCOUNT',
              data: { userId: user._id },
              message: 'Leider gibt es ein Problem mit deinem Konto. Bitte Kontaktiere das Team: info@print4.life',
              type: ErrorType.SERVER_ERROR
            };
            reject(error);
          }
          hospitalValid = hospitals[0].activated;
        }

        if (isMatch && !err && user.activated && hospitalValid) {
          // check hospital activation, too

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
        } else if (!user.activated || !hospitalValid) {
          error = {
            name: 'USER_DEACTIVATED',
            data: { userId: user._id },
            message: 'Dein Konto ist leider noch nicht aktiviert.',
            type: ErrorType.USER_DEACTIVATED
          };
          reject(error);
        } else {
          error = {
            name: 'AUTHENTIFICATION_FAILED',
            message: 'Login fehlgeschlagen. Falsches Passwort.',
            type: ErrorType.AUTHENTIFICATION_FAILED
          };
          reject(error);
        }
      });
    }));
  }

  /**
     * This method gets a user by its email
     * @param email the email to search for
     * @returns a promise with the result
     */
  public async getUserByEmail (email) {
    return User.findOne({ email });
  }

  /**
     * This method gets a user by its id
     * @param id is the id of the user
     * @returns a promise with the result
     */
  public async get (id) {
    return User.findById(id);
  }

  /**
     * This method gets a user by its token
     * @param token is the token to search the user by
     * @returns a promise with the result
     */
  public async getUserByToken (token) {
    const decoded = await jwt.verify(token, config.jwtSecret);
    return this.get(decoded._id);
  }

  /**
     * This method sends an email to the admins if a user wants to be activated
     * @param user is the new user
     * @param newUser boolean to indicate if it is a new user or a reactivation
     */
  public async informAdmins (user, newUser: boolean) {
    if (user.role.role === 'user') {
      let options: EmailOptions;

      const hospitals = await hospitalService.getAll({
        owner: user._id
      });

      if (hospitals.length === 1 && user.activated && !hospitals[0].activated) {
        options = {
          preferredLanguage: '',
          template: 'activateNewUser',
          to: '',
          locals:
          {
            adminName: '',
            userName: `${user.firstname} ${user.lastname}`,
            userEmail: user.email,
            hospitalName: hospitals[0].name,
            id: user._id,
            url: `${config.baseUrlFrontend}/hospitals/activate/${hospitals[0]._id}`,
            newUser
          }
        };
        User.find({ 'role.role': 'admin', activated: true }).then((admins) => {
          admins.forEach((admin) => {
            options.to = admin.email;
            options.preferredLanguage = admin.preferredLanguage.language || 'en';
            options.locals.adminName = `${admin.firstname} ${admin.lastname}`;
            emailService.sendMail(options);
          });
        });
      }
    }
  }

  /**
     * This method sends an email to the emailaddress of the newly generated user
     * @param user is the new user
     * @param newUser boolean to indicate if it is a new user or a reactivation
     */
  public async selfActivateUser (user, newUser: boolean) {
    if (user.role.role !== 'guest') {
      let options: EmailOptions;
      let url = `${config.baseUrlFrontend}/users/activate/${user._id}/`;
      if (user.role.role === 'user') {
        url += 'klinik';
      } else {
        url += 'maker';
      }

      if (!user.activated) {
        options = {
          preferredLanguage: user.preferredLanguage.language || 'de',
          template: 'selfActivateNewUser',
          to: user.email,
          locals:
          {
            adminName: '',
            userName: `${user.firstname} ${user.lastname}`,
            userEmail: user.email,
            id: user._id,
            url,
            newUser
          }
        };
        emailService.sendMail(options);
      } else if (user.role.role === 'user') {
        const hospitals = await hospitalService.getAll({
          owner: user._id
        });

        if (hospitals.length === 1) {
          if (!hospitals[0].activated) {
            await this.informAdmins(user, newUser);
            return true;
          }
        }
      }
    }

    return false;
  }

  /**
     * This method searches for users given a query
     * @param query is the query to search a user by
     * @param limit is the limit of results to get
     * @param skip is the amount of items to skip (counted from the beginning)
     * @returns a promise with the results
     */
  public search (query?: any, limit?: any, skip?: any) {
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

  /**
     * Counts users by a given query
     * @param query is the query to consider
     * @returns a promise with the results
     */
  public count (query) {
    return User.countDocuments(query);
  }

  /**
     * Updates a user
     * @param user contains the new user params
     * @returns a promise with the results
     */
  public async update (user) {
    delete user.__v;
    if (!user.createdAt) {
      user.createdAt = new Date();
    }
    return User.updateOne(
      { _id: user._id },
      user,
      { upsert: true }
    ).then(() => User.findOne({ _id: user._id }));
  }

  /**
     * Deletes a user by its id
     * @param _id is the id of the user
     * @returns a promise with the result
     */
  public async deleteById (_id) {
    const user = await this.get(_id);
    user.activated = false;
    return this.update(user);
  }


  public async ownsFablab (_id) {
    const fablab = await Fablab.findOne({ owner: _id });
    const owner = (fablab != null);
    return owner;
  }

  /**
     * Changes the password of the user
     * @param user is the user object
     * @param newPassword is the new password
     * @returns a promise with the result
     */
  public async changePassword (user, newPassword) {
    user.password = newPassword;
    return user.save(user);
  }

  /**
     * Resets the password of a user and sends it to the user via email
     * @param email is the email address of the user
     * @returns true or false depending on wether a user was found by the given email address or not
     */
  public async resetPassword (email: string) {
    const users = await this.search({ email }, 1, 0);
    let password: string;
    let user;
    if (users && users.length === 1) {
      ({ user } = { user: users[0] });
      user.password = `${Math.random().toString(36).substring(2, 15)}`;
      ({ password } = { password: `${user.password}` });
      try {
        await user.save();
        const options = {
          preferredLanguage: user.preferredLanguage.language ? user.preferredLanguage.language : 'en',
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

  /**
   * This method gets all iot devices. The result can be limited as well as some items skipped
   * @param limit is the limit of items to get
   * @param skip is the amount of items to skip (counted from the beginning)
   * @returns a promise with the results
   */
  getAll (query: any, limit?: string, skip?: string) {
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
  /* eslint-enable class-methods-use-this */
}

export default UserService;
