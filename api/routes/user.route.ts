import * as express from 'express';
import userCtrl from '../controllers/user.controller';
import logger from '../logger';
import routerService from '../services/router.service';
import validatorService from '../services/validator.service';

const router = express.Router();

router.use((req, res, next) => routerService.jwtValid(req, res, next));

router.post('/', (req, res) => {
  userCtrl.signUp(req.body).then((user) => {
    userCtrl.informAdmins(user);
    res.status(200).send({ user });
  }).catch((err) => {
    const msg = { error: 'Malformed user, one or more parameters wrong or missing', stack: err };
    logger.error(msg);
    res.status(400).send(msg);
  });
});

router.route('/roles').get((req, res) => {
  userCtrl.getRoles().then((roles) => {
    if (!roles) {
      res.status(204).send();
    } else {
      res.status(200).send({ roles });
    }
  }).catch((err) => {
    const msg = { error: 'Error while trying to get all valid roles!', stack: err };
    logger.error(msg);
    res.status(500).send(msg);
  });
});

router.route('/login').post(async (req, res) => {
  let user;
  try {
    user = await userCtrl.getUserByUsername(req.body.username);
  } catch (err) {
    const msg = { error: 'User not found.', stack: err };
    logger.error(msg);
    res.status(404).send(msg);
  }

  logger.info(`User "${user.username}" was found in DB and tried to login with a bad password.`);

  let login;
  try {
    login = await userCtrl.login(user, req.body.password);
  } catch (err) {
    const msg = { error: err.msg, stack: err, login: { success: false } };
    logger.error(msg);
    res.status(401).send(msg);
  }

  if (login.success) {
    logger.info(`${user.username} successfully logged in with token ${login.token}`);
    res.status(200).send({ login });
  }
});

router.route('/findown').get((req, res) => {
  if (req.headers && req.headers.authorization && typeof req.headers.authorization === 'string') {
    const token = req.headers.authorization.split('JWT')[1].trim();
    userCtrl.getUserByToken(token).then((user) => {
      if (user) {
        logger.info(`GET User by token with result ${user}`);
        res.status(200).send({ user });
      } else {
        const msg = { error: 'GET User by token with no result.' };
        logger.error(msg);
        res.status(404).send(msg);
      }
    }).catch((err) => {
      const msg = { error: 'Error while retrieving the user.', stack: err };
      logger.error(msg);
      res.status(500).send(msg);
    });
  } else {
    const msg = { error: 'No Authorization Header with JWT Token given.' };
    logger.error(msg);
    res.status(400).send(msg);
  }
});

router.route('/:id').get((req, res) => {
  const checkId = validatorService.checkId(req.params.id);
  if (checkId) {
    res.status(checkId.status).send({ error: checkId.error });
  } else {
    userCtrl.getUserById(req.params.id).then((user) => {
      if (user) {
        logger.info(`GET User by id with result ${user}`);
        res.status(200).send({ user });
      } else {
        const msg = { error: 'GET User by id with no result.' };
        logger.error(msg);
        res.status(404).send(msg);
      }
    }).catch((err) => {
      const msg = { error: 'Error while retrieving the user.', stack: err };
      logger.error(msg);
      res.status(500).send(msg);
    });
  }
});


export default router;
