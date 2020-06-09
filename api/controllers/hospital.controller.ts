import logger from '../logger';
import HospitalService from '../services/hospital.service';
import UserService from '../services/user.service';
import emailService from '../services/email.service';
import validatorService from '../services/validator.service';
import config from '../config/config';
import { searchableTextFields } from '../models/hospital.model';

const hospitalService = new HospitalService();
const userService = new UserService();


function getAll (req, res) {
  hospitalService.getAll()
    .then((hospitals) => {
      logger.info(`GET Hospitals with result ${JSON.stringify(hospitals)}`);
      res.json({ hospitals });
    })
    .catch((err) => {
      logger.error(err);
      res.status(500).send(err);
    });
}

async function get (req, res) {
  const checkId = validatorService.checkId(
    req.params && req.params.id ? req.params.id : undefined
  );
  if (checkId) {
    logger.error(checkId.error);
    return res.status(checkId.status).send(checkId.error);
  }
  let authorized = false;
  if (req.headers.authorization) {
    const token = req.headers.authorization.split('JWT')[1].trim();
    const ownUser = await userService.getUserByToken(token);

    authorized = ownUser;
  }
  if (!authorized) {
    const msg = { error: '401 Unauthorized' };
    logger.error(msg);
    return res.status(401).send(msg);
  }
  try {
    const hospital = await hospitalService.get(req.params.id);
    if (!hospital) {
      logger.error({ error: `Hospital by id '${req.params.id}' not found` });
      return res.status(404).send(
        { error: `Hospital by id '${req.params.id}' not found` }
      );
    }
    logger.info(`GET HospitalById with result ${JSON.stringify(hospital)}`);
    return res.json({ hospital });
  } catch (err) {
    logger.error(err);
    return res.status(500).send(err);
  }
}

async function create (req, res) {
  // check admin permissions, see #178
  // const token = req.headers.authorization.split('JWT')[1].trim();
  // const user = await userService.getUserByToken(token);
  // TODO check wether user already is part of a hospital
  hospitalService.create(req.body)
    .then((hospital) => {
      logger.info(`POST Hospital with result ${JSON.stringify(hospital)}`);
      res.status(201).send({ hospital });
    })
    .catch((err) => {
      const msg = { err: 'Malformed request!', stack: err };
      logger.error(msg);
      res.status(400).send(msg);
    });
}

async function search (req, res) {
  req.body.query = validatorService.checkQuery(req.body.query, searchableTextFields);
  let authorized = false;
  if (req.headers.authorization) {
    const token = req.headers.authorization.split('JWT')[1].trim();
    const ownUser = await userService.getUserByToken(token);
    authorized = ownUser;
  }
  if (!authorized) {
    const msg = { error: '401 Unauthorized' };
    logger.error(msg);
    return res.status(401).send(msg);
  }
  hospitalService.getAll(req.body.query, req.body.limit, req.body.skip).lean().then((hospitals) => {
    if (hospitals.length === 0) {
      logger.info(`POST search for hospitals with query ${JSON.stringify(req.body.query)}, `
        + `limit ${req.body.limit} skip ${req.body.skip} holds no results`);
      return res.status(204).send({ hospitals });
    } if (req.body.limit && req.body.skip) {
      logger.info(`POST search for hospitals with query ${JSON.stringify(req.body.query)}, `
        + `limit ${req.body.limit} skip ${req.body.skip} `
        + `holds partial results ${JSON.stringify(hospitals)}`);
      return res.status(206).send({ hospitals });
    }
    logger.info(`POST search for hospitals with query ${JSON.stringify(req.body.query)}, `
        + `limit ${req.body.limit} skip ${req.body.skip} `
        + `holds results ${JSON.stringify(hospitals)}`);
    return res.status(200).send({ hospitals });
  });
  return undefined;
}


async function update (req, res) {
  // check admin permissions, see #178
  const token = req.headers.authorization.split('JWT')[1].trim();
  const user = await userService.getUserByToken(token);
  const checkId = validatorService.checkId(
    req.params && req.params.id ? req.params.id : undefined
  );
  if (checkId) {
    logger.error(checkId.error);
    return res.status(checkId.status).send(checkId.error);
  }
  if (Object.keys(req.body).length === 0) {
    const msg = { error: 'No params to update given!' };
    logger.error(msg);
    return res.status(400).send(msg);
  }
  try {
    let hospital = await hospitalService.get(req.params.id);
    if (!hospital) {
      const msg = { error: `Hospital by id '${req.params.id}' not found` };
      logger.error(msg);
      return res.status(404).send(msg);
    }
    if (hospital.owner !== user._id && (user.role.role !== 'admin')) {
      const msg = { err: 'FORBIDDEN', message: 'User doesn\'t own this hospital!' };

      return res.status(403).send(msg);
    }
    hospital = await hospitalService.update(req.params.id, req.body);
    logger.info(`PUT Fablab with result ${JSON.stringify(hospital)}`);
    return res.status(200).send({ hospital });
  } catch (err) {
    const msg = { err: 'Malformed request!', stack: err };
    logger.error(msg);
    return res.status(400).send(msg);
  }
}

async function deleteById (req, res) {
  const token = req.headers.authorization.split('JWT')[1].trim();
  const user = await userService.getUserByToken(token);
  const checkId = validatorService.checkId(
    req.params && req.params.id ? req.params.id : undefined
  );
  if (checkId) {
    logger.error(checkId.error);
    return res.status(checkId.status).send(checkId.error);
  }
  try {
    let hospital = await hospitalService.get(req.params.id);
    if (!hospital) {
      const msg = { error: `Hospital by id '${req.params.id}' not found` };
      logger.error(msg);
      return res.status(404).send(msg);
    }
    if (hospital.owner !== user._id && (user.role.role !== 'admin')) {
      const msg = { err: 'FORBIDDEN', message: 'User doesn\'t own this hospital!' };
      return res.status(403).send(msg);
    }
    hospital = await hospitalService.deleteById(req.params.id);
    logger.info(`DELETE Hospital with result ${JSON.stringify(hospital)}`);
    return res.status(200).send({ hospital });
  } catch (err) {
    logger.error({ error: 'Malformed Request!', stack: err });
    return res.status(400).send({ error: 'Malformed Request!', stack: err });
  }
}

async function activate (req, res) {
  let authorized = false;
  if (req.headers.authorization) {
    const token = req.headers.authorization.split('JWT')[1].trim();
    const ownUser = await userService.getUserByToken(token);
    authorized = ownUser && (ownUser.role.role === 'admin');
  }
  if (!authorized) {
    const msg = { error: '401 Unauthorized' };
    logger.error(msg);
    return res.status(401).send(msg);
  }
  const checkId = validatorService.checkId(req.params && req.params.id ? req.params.id : undefined);
  if (checkId) {
    logger.error(checkId.error);
    return res.status(checkId.status).send(checkId.error);
  }

  const token = req.headers.authorization.split('JWT')[1].trim();
  const user = await userService.getUserByToken(token);
  if (user.role.role !== 'admin') {
    const msg = { err: 'FORBIDDEN', message: 'User can not update Hospitals!' };

    return res.status(403).send(msg);
  }

  try {
    const hospital = await hospitalService.update(req.params.id, { activated: true });

    const user = await userService.get(hospital.owner);
    const { email } = user;

    const options = {
      preferredLanguage: 'de',
      template: 'hospitalActivated',
      to: email,
      locals:
      {
        userName: `${user.firstname} ${user.lastname}`,
        hospitalName: hospital.name,
        url: `${config.baseUrlFrontend}/users/login`,
      }
    };

    emailService.sendMail(options);


    return res.status(200).send({ hospital });
  } catch (err) {
    logger.error({ error: 'Malformed Request!', stack: err });
    return res.status(400).send({ error: 'Malformed Request!', stack: err });
  }
}

export default {
  get, getAll, create, update, deleteById, search, activate
};
