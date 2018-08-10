import * as express from 'express';
import lasercutterCtrl from '../controllers/lasercutter.controller';
import logger from '../logger';
import validatorService from '../services/validator.service';

const router = express.Router();

router.route('/').get((req, res) => {
  lasercutterCtrl.getAll(req.query.limit, req.query.skip).then((lasercutters) => {
    if ((lasercutters && lasercutters.length === 0) || !lasercutters) {
      logger.info('GET Lasercutters with no result');
      res.status(204).send();
    } else if (lasercutters && req.query.limit && req.query.skip) {
      logger.info(`GET Lasercutters with partial result ${lasercutters}`);
      res.status(206).send({ lasercutters });
    } else if (lasercutters) {
      logger.info(`GET Lasercutters with result ${lasercutters}`);
      res.status(200).send({ lasercutters });
    }
  }).catch((err) => {
    logger.error(err);
    res.status(500).send(err);
  });
});

router.route('/count').get((req, res) => {
  lasercutterCtrl.count().then((count) => {
    logger.info(`Count Lasercutters with result ${count}`);
    res.status(200).send({ count });
  }).catch((err) => {
    logger.error(err);
    res.status(500).send(err);
  });
});

router.route('/laserTypes').get((req, res) => {
  lasercutterCtrl.getLaserTypes().then((laserTypes) => {
    if (laserTypes && laserTypes.length === 0) {
      logger.info('GET Lasertypes with no result');
      res.status(204).send();
    } else if (laserTypes) {
      logger.info(`GET Lasertypes with result ${laserTypes}`);
      res.status(200).send({ laserTypes });
    }
  }).catch((err) => {
    logger.error(err);
    res.status(500).send(err);
  });
});

router.route('/').post((req, res) => {
  lasercutterCtrl.create(req.body).then((lasercutter) => {
    logger.info(`POST Lasercutter with result ${lasercutter}`);
    res.status(201).send({ lasercutter });
  }).catch((err) => {
    const msg = { error: 'Malformed request!', stack: err };
    logger.error(msg);
    res.status(400).send(msg);
  });
});

router.route('/:id').delete((req, res) => {
  const checkId = validatorService.checkId(req.params.id);
  if (checkId) {
    logger.error({ error: checkId.error });
    res.status(checkId.status).send({ error: checkId.error });
  } else {
    let lasercutter;
    lasercutterCtrl.get(req.params.id).then((l) => {
      if (l) {
        lasercutter = l;
        lasercutterCtrl.deleteById(req.params.id).then((result) => {
          if (result) {
            lasercutterCtrl.get(req.params.id).then((result) => {
              if (!result) {
                logger.info(`DELETE Lasercutter with result ${lasercutter}`);
                res.status(200).send({ lasercutter });
              }
            }).catch((err) => {
              const msg = {
                err: `Error while trying to get the Lasercutter by id ${req.params.id}`,
                stack: err
              };
              logger.error(msg);
              res.status(500).send(msg);
            });
          } else {
            const msg = { error: `Error while trying to delete the Lasercutter with id ${req.params.id}` };
            logger.error(msg);
            res.status(500).send(msg);
          }
        }).catch((err) => {
          const msg = { error: 'Malformed request!', stack: err };
          logger.error(msg);
          res.status(400).send(msg);
        });
      } else {
        const msg = { error: `Lasercutter by id ${req.params.id} not found!` };
        logger.error(msg);
        res.status(404).send(msg);
      }
    }).catch((err) => {
      const msg = { error: `Error while trying to get the Lasercutter by id ${req.params.id}`, stack: err };
      logger.error(msg);
      res.status(500).send(msg);
    });
  }
});

router.route('/:id').get((req, res) => {
  const checkId = validatorService.checkId(req.params.id);
  if (checkId) {
    logger.error({ error: checkId.error });
    res.status(checkId.status).send({ error: checkId.error });
  } else {
    lasercutterCtrl.get(req.params.id).then((lasercutter) => {
      if (!lasercutter) {
        const msg = { error: `Lasercutter by id '${req.params.id}' not found` };
        logger.error(msg);
        res.status(404).send(msg);
      } else {
        logger.info(`GET LasercutterById with result ${lasercutter}`);
        res.status(200).send({ lasercutter });
      }
    }).catch((err) => {
      const msg = { error: 'Malformed request!', stack: err };
      logger.error(msg);
      res.status(400).send(msg);
    });
  }
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
    lasercutterCtrl.get(req.params.id).then((lasercutter) => {
      if (!lasercutter) {
        const msg = { error: `Lasercutter by id '${req.params.id}' not found` };
        logger.error(msg);
        res.status(404).send(msg);
      } else {
        lasercutterCtrl.update(req.params.id, req.body).then((lasercutter) => {
          logger.info(`PUT Lasercutter with result ${lasercutter}`);
          res.status(200).send({ lasercutter });
        });
      }
    }).catch((err) => {
      const msg = { error: 'Malformed request!', stack: err };
      logger.error(msg);
      res.status(400).send(msg);
    });
  }
});

export default router;
