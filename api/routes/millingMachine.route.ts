import * as express from 'express';
import millingMachineCtrl from '../controllers/millingMachine.controller';
import logger from '../logger';

const router = express.Router();

router.route('/').get((req, res) => {
  millingMachineCtrl.getAll(req.query.limit, req.query.skip).then((millingMachines) => {
    if (millingMachines && millingMachines.length === 0) {
      res.status(204).send();
    } else if (millingMachines) {
      res.status(200).send({ millingMachines });
    }
  }).catch((err) => {
    logger.error(err);
    res.status(500).send(err);
  });
});

router.route('/count').get((req, res) => {
  millingMachineCtrl.count().then((count) => {
    res.status(200).send({ count });
  }).catch((err) => {
    logger.error(err);
    res.status(500).send(err);
  });
});

router.route('/').post((req, res) => {
  millingMachineCtrl.create(req.body).then((millingMachine) => {
    res.status(201).send({ millingMachine });
  }).catch((err) => {
    logger.error(err);
    res.status(400).send({ error: 'Malformed request!', stack: err });
  });
});

router.route('/:id').delete((req, res) => {
  if (req.params.id.length !== 24) {
    res.status(400).send({ error: 'Id needs to be a 24 character long hex string!' });
  } else {
    let millingMachine;
    millingMachineCtrl.get(req.params.id).then((m) => {
      if (m) {
        millingMachine = m;
        millingMachineCtrl.deleteById(req.params.id).then((result) => {
          if (result) {
            millingMachineCtrl.get(req.params.id).then((result) => {
              if (!result) {
                res.status(200).send({ millingMachine });
              }
            }).catch((err) => {
              logger.error(err);
              res.status(500).send(
                {
                  err: `Error while trying to get the Milling Machine by id ${req.params.id}`,
                  stack: err
                }
              );
            });
          } else {
            res.status(500).send(
              {
                error: `Error while trying to delete the Milling Machine with id ${req.params.id}`
              });
          }
        }).catch((err) => {
          logger.error(err);
          res.status(400).send({ error: 'Malformed request!', stack: err });
        });
      } else {
        logger.error(`Milling Machine by id ${req.params.id} not found!`);
        res.status(404).send({ error: `Milling Machine by id ${req.params.id} not found!` });
      }
    }).catch((err) => {
      logger.error(err);
      res.status(500).send({
        error: `Error while trying to get the Milling Machine by id ${req.params.id}`, stack: err
      });
    });
  }
});

router.route('/:id').get((req, res) => {
  if (req.params.id.length !== 24) {
    res.status(400).send({ error: 'Id needs to be a 24 character long hex string!' });
  } else {
    millingMachineCtrl.get(req.params.id).then((millingMachine) => {
      if (!millingMachine) {
        res.status(404).send({ error: `Milling Machine by id '${req.params.id}' not found` });
      } else {
        res.status(200).send({ millingMachine });
      }
    }).catch((err) => {
      logger.error(err);
      res.status(400).send({ error: 'Malformed request!', stack: err });
    });
  }
});

router.route('/:id').put((req, res) => {
  if (req.params.id.length !== 24) {
    res.status(400).send({ error: 'Id needs to be a 24 character long hex string!' });
  } else if (Object.keys(req.body).length === 0) {
    res.status(400).send({ error: 'No params to update given!' });
  } else {
    millingMachineCtrl.get(req.params.id).then((millingMachine) => {
      if (!millingMachine) {
        res.status(404).send({ error: `Milling Machine by id '${req.params.id}' not found` });
      } else {
        millingMachineCtrl.update(req.params.id, req.body).then((millingMachine) => {
          res.status(200).send({ millingMachine });
        });
      }
    }).catch((err) => {
      logger.error(err);
      res.status(400).send({ error: 'Malformed request!', stack: err });
    });
  }
});

export default router;
