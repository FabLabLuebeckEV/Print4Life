import * as express from 'express';
import otherMachineCtrl from '../controllers/otherMachine.controller';
import logger from '../logger';
import validatorService from '../services/validator.service';

const router = express.Router();

router.route('/').get((req, res) => {
  otherMachineCtrl.getAll(req.query.limit, req.query.skip).then((otherMachines) => {
    if ((otherMachines && otherMachines.length === 0) || !otherMachines) {
      logger.info('GET Other Machines with no result');
      res.status(204).send();
    } else if (otherMachines && req.query.limit && req.query.skip) {
      logger.info(`GET Other Machines with partial result ${JSON.stringify(otherMachines)}`);
      res.status(206).send({ otherMachines });
    } else if (otherMachines) {
      logger.info(`GET Other Machines with result ${JSON.stringify(otherMachines)}`);
      res.status(200).send({ otherMachines });
    }
  }).catch((err) => {
    const msg = { error: 'Error while trying to get all Other Machines', stack: err };
    logger.error(msg);
    res.status(500).send(msg);
  });
});

router.route('/count').get((req, res) => {
  otherMachineCtrl.count().then((count) => {
    logger.info(`GET count other machines with result ${JSON.stringify(count)}`);
    res.status(200).send({ count });
  }).catch((err) => {
    const msg = { error: 'Error while trying to count other machines', stack: err };
    logger.error(msg);
    res.status(500).send(msg);
  });
});

router.route('/').post((req, res) => {
  otherMachineCtrl.create(req.body).then((otherMachine) => {
    logger.info(`POST Other Machine with result ${JSON.stringify(otherMachine)}`);
    res.status(201).send({ otherMachine });
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
    let otherMachine;
    otherMachineCtrl.get(req.params.id).then((o) => {
      if (o) {
        otherMachine = o;
        otherMachineCtrl.deleteById(req.params.id).then((result) => {
          if (result) {
            otherMachineCtrl.get(req.params.id).then((result) => {
              if (!result) {
                logger.info(`DELETE Other Machine with result ${JSON.stringify(otherMachine)}`);
                res.status(200).send({ otherMachine });
              }
            }).catch((err) => {
              const msg = {
                err: `Error while trying to get the Other Machine by id ${req.params.id}`,
                stack: err
              };
              logger.error(msg);
              res.status(500).send(msg);
            });
          } else {
            const msg = { error: `Error while trying to delete the Other Machine with id ${req.params.id}` };
            logger.error(msg);
            res.status(500).send(msg);
          }
        }).catch((err) => {
          const msg = { error: 'Malformed request!', stack: err };
          logger.error(msg);
          res.status(400).send(msg);
        });
      } else {
        const msg = { error: `Other Machine by id ${req.params.id} not found!` };
        logger.error(msg);
        res.status(404).send(msg);
      }
    }).catch((err) => {
      const msg = { error: `Error while trying to get the Other Machine by id ${req.params.id}`, stack: err };
      logger.error(msg);
      res.status(500).send(msg);
    });
  }
});

router.route('/:id').get((req, res) => {
  const checkId = validatorService.checkId(req.params.id);
  if (checkId) {
    const msg = { error: checkId.error };
    logger.error(msg);
    res.status(checkId.status).send(msg);
  } else {
    otherMachineCtrl.get(req.params.id).then((otherMachine) => {
      if (!otherMachine) {
        const msg = { error: `Other Machine by id '${req.params.id}' not found` };
        logger.error(msg);
        res.status(404).send(msg);
      } else {
        logger.info(`GET Other Machine by Id with result ${JSON.stringify(otherMachine)}`);
        res.status(200).send({ otherMachine });
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
    res.status(400).send({ error: 'No params to update given!' });
  } else {
    otherMachineCtrl.get(req.params.id).then((otherMachine) => {
      if (!otherMachine) {
        const msg = { error: `Other Machine by id '${req.params.id}' not found` };
        logger.error(msg);
        res.status(404).send(msg);
      } else {
        otherMachineCtrl.update(req.params.id, req.body).then((otherMachine) => {
          logger.info(`PUT Other Machine with result ${JSON.stringify(otherMachine)}`);
          res.status(200).send({ otherMachine });
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
