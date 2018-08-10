import * as express from 'express';
import otherMachineCtrl from '../controllers/otherMachine.controller';
import logger from '../logger';
import validatorService from '../services/validator.service';

const router = express.Router();

router.route('/').get((req, res) => {
  otherMachineCtrl.getAll(req.query.limit, req.query.skip).then((otherMachines) => {
    if (otherMachines && otherMachines.length === 0) {
      res.status(204).send();
    } else if (otherMachines) {
      res.status(200).send({ otherMachines });
    }
  }).catch((err) => {
    logger.error(err);
    res.status(500).send(err);
  });
});

router.route('/count').get((req, res) => {
  otherMachineCtrl.count().then((count) => {
    res.status(200).send({ count });
  }).catch((err) => {
    logger.error(err);
    res.status(500).send(err);
  });
});

router.route('/').post((req, res) => {
  otherMachineCtrl.create(req.body).then((otherMachine) => {
    res.status(201).send({ otherMachine });
  }).catch((err) => {
    logger.error(err);
    res.status(400).send({ error: 'Malformed request!', stack: err });
  });
});

router.route('/:id').delete((req, res) => {
  const checkId = validatorService.checkId(req.params.id);
  if (checkId) {
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
                res.status(200).send({ otherMachine });
              }
            }).catch((err) => {
              logger.error(err);
              res.status(500).send(
                {
                  err: `Error while trying to get the Other Machine by id ${req.params.id}`,
                  stack: err
                }
              );
            });
          } else {
            res.status(500).send({ error: `Error while trying to delete the Other Machine with id ${req.params.id}` });
          }
        }).catch((err) => {
          logger.error(err);
          res.status(400).send({ error: 'Malformed request!', stack: err });
        });
      } else {
        logger.error(`Other Machine by id ${req.params.id} not found!`);
        res.status(404).send({ error: `Other Machine by id ${req.params.id} not found!` });
      }
    }).catch((err) => {
      logger.error(err);
      res.status(500).send({ error: `Error while trying to get the Other Machine by id ${req.params.id}`, stack: err });
    });
  }
});

router.route('/:id').get((req, res) => {
  const checkId = validatorService.checkId(req.params.id);
  if (checkId) {
    res.status(checkId.status).send({ error: checkId.error });
  } else {
    otherMachineCtrl.get(req.params.id).then((otherMachine) => {
      if (!otherMachine) {
        res.status(404).send({ error: `Other Machine by id '${req.params.id}' not found` });
      } else {
        res.status(200).send({ otherMachine });
      }
    }).catch((err) => {
      logger.error(err);
      res.status(400).send({ error: 'Malformed request!', stack: err });
    });
  }
});

router.route('/:id').put((req, res) => {
  const checkId = validatorService.checkId(req.params.id);
  if (checkId) {
    res.status(checkId.status).send({ error: checkId.error });
  } else if (Object.keys(req.body).length === 0) {
    res.status(400).send({ error: 'No params to update given!' });
  } else {
    otherMachineCtrl.get(req.params.id).then((otherMachine) => {
      if (!otherMachine) {
        res.status(404).send({ error: `Other Machine by id '${req.params.id}' not found` });
      } else {
        otherMachineCtrl.update(req.params.id, req.body).then((otherMachine) => {
          res.status(200).send({ otherMachine });
        });
      }
    }).catch((err) => {
      logger.error(err);
      res.status(400).send({ error: 'Malformed request!', stack: err });
    });
  }
});


export default router;
