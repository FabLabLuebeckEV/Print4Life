import * as express from 'express';
import * as passport from 'passport';
import userCtrl from '../controllers/user.controller';
import logger from '../logger';

const router = express.Router();

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

router.route('/login').post((req, res) => {
  const user = userCtrl.getUserByUsername(req.body.username);
  const login = userCtrl.login(user);
  if (login.success) {
    res.status(200).send({ login });
  } else {
    logger.error({ error: login.msg });
    res.status(401).send({ login });
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
