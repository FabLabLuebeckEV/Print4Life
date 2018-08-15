import * as express from 'express';
import userCtrl from '../controllers/user.controller';
import logger from '../logger';
// import validatorService from '../services/validator.service';

const router = express.Router();

router.post('/signup', (req, res) => {
  if (!req.body.username || !req.body.password) {
    logger.error({ error: 'Malformed user, one or more parameters wrong or missing' });
    res.status(400).send({ error: 'Malformed user, one or more parameters wrong or missing' });
  } else {
    userCtrl.signUp(req.body);
  }
  userCtrl.signUp(req.body).then((user) => {
    res.status(200).send(user);
  }).catch((err) => {
    const msg = { error: 'Malformed user, one or more parameters wrong or missing', stack: err };
    logger.error(msg);
    res.status(400).send(msg);
  });
});
