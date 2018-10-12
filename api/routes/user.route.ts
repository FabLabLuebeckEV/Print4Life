import * as express from 'express';
import userCtrl from '../controllers/user.controller';
import logger from '../logger';
import routerService, { ErrorType } from '../services/router.service';
import validatorService from '../services/validator.service';

const router = express.Router();

router.use((req, res, next) => routerService.jwtValid(req, res, next));

router.post('/', (req, res) => {
  userCtrl.signUp(req.body).then((user) => {
    userCtrl.informAdmins(user, true);
    res.status(200).send({ user });
  }).catch((err) => {
    const msg = { error: 'Malformed user, one or more parameters wrong or missing', stack: err };
    logger.error(msg);
    res.status(400).send(msg);
  });
});

router.route('/search').post((req, res) => {
  userCtrl.getUsers(req.body.query, req.body.limit, req.body.skip).then((users) => {
    if (users.length === 0) {
      logger.info(`POST search for users with query ${JSON.stringify(req.body.query)}, ` +
        `limit ${req.body.limit} skip ${req.body.skip} holds no results`);
      res.status(204).send({ users });
    } else if (req.body.limit && req.body.skip) {
      logger.info(`POST search for users with query ${JSON.stringify(req.body.query)}, ` +
        `limit ${req.body.limit} skip ${req.body.skip} ` +
        `holds partial results ${JSON.stringify(users)}`);
      res.status(206).send({ users });
    } else {
      logger.info(`POST search for users with query ${JSON.stringify(req.body.query)}, ` +
        `limit ${req.body.limit} skip ${req.body.skip} ` +
        `holds results ${JSON.stringify(users)}`);
      res.status(200).send({ users });
    }
  }).catch((err) => {
    logger.error({
      error: `Error while trying to search for a specific user with query: ${JSON.stringify(req.body.query)}`,
      stack: err
    });
    res.status(500).send({
      error: `Error while trying to search for a specific user with query: ${JSON.stringify(req.body.query)}`,
      stack: err
    });
  });
});

router.route('/count').post((req, res) => {
  userCtrl.count(req.body.query).then((count) => {
    logger.info(`POST count with result ${JSON.stringify(count)}`);
    res.status(200).send({ count });
  }).catch((err) => {
    logger.error({ error: 'Error while counting users!', err });
    res.status(500).send({ error: 'Error while counting users!', err });
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
    const msg = { type: err.type, error: err.msg, stack: err, data: undefined, login: { success: false } };
    logger.error(msg);
    if (err.type === ErrorType.USER_DEACTIVATED) {
      msg.data = err.data;
      res.status(403).send(msg);
    } else {
      res.status(401).send(msg);
    }
  }

  if (login && login.success) {
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

/**
 * @api {post} /api/v1/users/activationRequest/:id activate a user
 * @apiName activationRequestByUser
 * @apiVersion 1.0.0
 * @apiGroup Users
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiSuccess { object } an response object
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "msg": "Admins informed"
}
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
  {
      "error": "'GET User by id with no result.'",
  }

 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Server Error
  {
      "error": "Error while retrieving the user.",
      "stack": {
          ...
      }
  }
 */
router.route('/activationRequest/:id').put((req, res) => {
  const checkId = validatorService.checkId(req.params.id);
  if (checkId) {
    res.status(checkId.status).send({ error: checkId.error });
  } else {
    userCtrl.getUserById(req.params.id).then((user) => {
      if (user) {
        userCtrl.informAdmins(user, false);
        res.status(200).send({ msg: 'Admins informed' });
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
