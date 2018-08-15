import * as express from 'express';
import userCtrl from '../controllers/user.controller';
import logger from '../logger';
// import validatorService from '../services/validator.service';

const router = express.Router();

router.post('/signup', (req, res) => {
  userCtrl.signUp(req.body).then((user) => {
    res.status(200).send(user);
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
    logger.error({ error: 'Error while trying to get all valid roles!', stack: err });
    res.status(500).send({ error: 'Error while trying to get all valid roles!', stack: err });
  });
});

export default router;
