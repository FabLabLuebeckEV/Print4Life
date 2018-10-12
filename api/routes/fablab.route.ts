import * as express from 'express';
import fablabCtrl from '../controllers/fablab.controller';
import logger from '../logger';
import validatorService from '../services/validator.service';
import routerService from '../services/router.service';

const router = express.Router();

router.use((req, res, next) => routerService.jwtValid(req, res, next));

router.route('/').get((req, res) => {
  fablabCtrl.getAll().then((fablabs) => {
    logger.info(`GET Fablabs with result ${JSON.stringify(fablabs)}`);
    fablabs.forEach((fablab) => {
      delete fablab.password;
    });
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
    fablabCtrl.get(req.params.id).then((fablab) => {
      if (!fablab) {
        logger.error({ error: `Fablab by id '${req.params.id}' not found` });
        res.status(404).send({ error: `Fablab by id '${req.params.id}' not found` });
      } else {
        logger.info(`GET FablabById with result ${JSON.stringify(fablab)}`);
        res.json({ fablab });
      }
    }).catch((err) => {
      logger.error(err);
      res.status(500).send(err);
    });
  }
});

router.route('/').post((req, res) => {
  fablabCtrl.create(req.body).then((fablab) => {
    logger.info(`POST Fablab with result ${JSON.stringify(fablab)}`);
    res.status(201).send({ fablab });
  }).catch((err) => {
    const msg = { err: 'Malformed request!', stack: err };
    logger.error(msg);
    res.status(400).send(msg);
  });
});

router.route('/:id').put((req, res) => {
  const checkId = validatorService.checkId(req.params.id);
  if (checkId) {
    logger.error({ error: checkId.error });
    res.status(checkId.status).send({ error: checkId.error });
  } else if (Object.keys(req.body).length === 0) {
    const msg = { error: 'No params to update given!' };
    logger.error(msg);
    res.status(400).send(msg);
  } else {
    fablabCtrl.get(req.params.id).then((fablab) => {
      if (!fablab) {
        const msg = { error: `Fablab by id '${req.params.id}' not found` };
        logger.error(msg);
        res.status(404).send(msg);
      } else {
        fablabCtrl.update(req.params.id, req.body).then((fablab) => {
          logger.info(`PUT Fablab with result ${JSON.stringify(fablab)}`);
          res.status(200).send({ fablab });
        });
      }
    }).catch((err) => {
      const msg = { err: 'Malformed request!', stack: err };
      logger.error(msg);
      res.status(400).send(msg);
    });
  }
});

export default router;
