import * as express from 'express';
import millingMachineCtrl from '../controllers/millingMachine.controller';
import logger from '../logger';
import validatorService from '../services/validator.service';

const router = express.Router();

router.route('/').get((req, res) => {
  millingMachineCtrl.getAll(req.query.limit, req.query.skip).then((millingMachines) => {
    if ((millingMachines && millingMachines.length === 0) || !millingMachines) {
      logger.info('GET Milling Machines with no result');
      res.status(204).send();
    } else if (millingMachines && req.query.limit && req.query.skip) {
      logger.info(`GET Milling Machines with partial result ${JSON.stringify(millingMachines)}`);
      res.status(206).send({ millingMachines });
    } else if (millingMachines) {
      logger.info(`GET Milling Machines with result ${JSON.stringify(millingMachines)}`);
      res.status(200).send({ millingMachines });
    }
  }).catch((err) => {
    const msg = { error: 'Error while trying to get all milling machines!', stack: err };
    logger.error(msg);
    res.status(500).send(msg);
  });
});

router.route('/count').get((req, res) => {
  millingMachineCtrl.count().then((count) => {
    logger.info(`GET count milling machines with result ${JSON.stringify(count)}`);
    res.status(200).send({ count });
  }).catch((err) => {
    const msg = { error: 'Error while trying to count milling machines', stack: err };
    logger.error(msg);
    res.status(500).send(msg);
  });
});

router.route('/').post((req, res) => {
  millingMachineCtrl.create(req.body).then((millingMachine) => {
    logger.info(`POST Milling Machine with result ${JSON.stringify(millingMachine)}`);
    res.status(201).send({ millingMachine });
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
    let millingMachine;
    millingMachineCtrl.get(req.params.id).then((m) => {
      if (m) {
        millingMachine = m;
        millingMachineCtrl.deleteById(req.params.id).then((result) => {
          if (result) {
            millingMachineCtrl.get(req.params.id).then((result) => {
              if (!result) {
                logger.info(`DELETE Milling Machine with result ${JSON.stringify(millingMachine)}`);
                res.status(200).send({ millingMachine });
              }
            }).catch((err) => {
              const msg = {
                err: `Error while trying to get the Milling Machine by id ${req.params.id}`,
                stack: err
              };
              logger.error(msg);
              res.status(500).send(msg);
            });
          } else {
            const msg = {
              error: `Error while trying to delete the Milling Machine with id ${req.params.id}`
            };
            logger.error(msg);
            res.status(500).send(msg);
          }
        }).catch((err) => {
          const msg = { error: 'Malformed request!', stack: err };
          logger.error(msg);
          res.status(400).send(msg);
        });
      } else {
        const msg = { error: `Milling Machine by id ${req.params.id} not found!` };
        logger.error(msg);
        res.status(404).send(msg);
      }
    }).catch((err) => {
      const msg = {
        error: `Error while trying to get the Milling Machine by id ${req.params.id}`, stack: err
      };
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
    millingMachineCtrl.get(req.params.id).then((millingMachine) => {
      if (!millingMachine) {
        const msg = { error: `Milling Machine by id '${req.params.id}' not found` };
        logger.error(msg);
        res.status(404).send(msg);
      } else {
        logger.info(`GET Milling Machine by id with result ${JSON.stringify(millingMachine)}`);
        res.status(200).send({ millingMachine });
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
    millingMachineCtrl.get(req.params.id).then((millingMachine) => {
      if (!millingMachine) {
        const msg = { error: `Milling Machine by id '${req.params.id}' not found` };
        logger.error(msg);
        res.status(404).send(msg);
      } else {
        millingMachineCtrl.update(req.params.id, req.body).then((millingMachine) => {
          logger.info(`PUT Milling Machine with result ${JSON.stringify(millingMachine)}`);
          res.status(200).send({ millingMachine });
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
