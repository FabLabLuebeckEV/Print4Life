import * as express from 'express';
import * as passport from 'passport';
import userCtrl from '../controllers/user.controller';
import logger from '../logger';
import routerService from '../services/router.service';

const router = express.Router();

router.use((req, res, next) => routerService.jwtValid(req, res, next));

router.post('/', (req, res) => {
  userCtrl.signUp(req.body).then((user) => {
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
    logger.info(`${user.username} successfully logged in with token: ${login.token}`);
    res.status(200).send({ login });
  }
});

router.route('/:id').get(passport.authenticate('jwt', { session: false }), (req, res) => {
  userCtrl.getUserById(req.params.id).then((user) => {
    logger.info(`GET User by id with result ${user}`);
    res.status(200).send({ user });
  }).catch((err) => {
    const msg = { error: 'GET User by id with no result.', stack: err };
    logger.error(msg);
    res.status(400).send(msg);
  });
});


export default router;
