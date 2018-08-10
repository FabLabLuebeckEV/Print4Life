import * as express from 'express';
import fablabCtrl from '../controllers/fablab.controller';
import logger from '../logger';
import validatorService from '../services/validator.service';

const router = express.Router();

router.route('/').get((req, res) => {
  fablabCtrl.getAll().then((fablabs) => {
    logger.info(`GET Fablabs with result ${fablabs}`);
    res.json({ fablabs });
  }).catch((err) => {
    logger.error(err);
    res.status(500).send(err);
  });
});

router.route('/:id').get((req, res) => {
  const checkId = validatorService.checkId(req.params.id);
  if (checkId) {
    logger.error({ error: checkId.error });
    res.status(checkId.status).send({ error: checkId.error });
  } else {
    fablabCtrl.getFablab(req.params.id).then((fablab) => {
      if (!fablab) {
        logger.error({ error: `Fablab by id '${req.params.id}' not found` });
        res.status(404).send({ error: `Fablab by id '${req.params.id}' not found` });
      } else {
        logger.info(`GET FablabById with result ${fablab}`);
        res.json({ fablab });
      }
    }).catch((err) => {
      logger.error(err);
      res.status(500).send(err);
    });
  }
});

export default router;
