import * as express from 'express';
import otherMachineCtrl from '../controllers/otherMachine.controller';
import logger from '../logger';

const router = express.Router();

router.route('/').get((req, res) => {
  otherMachineCtrl.getAll().then((otherMachines) => {
    res.json({ otherMachines });
  }).catch((err) => {
    res.status(500).send(err);
  });
});

router.route('/create').post((req, res) => {
  otherMachineCtrl.create(req.body).then((otherMachine) => {
    res.status(201).send({ otherMachine });
  }).catch((err) => {
    res.status(400).send({ error: 'Malformed request!', stack: err });
  });
});

router.route('/:id').delete((req, res) => {
  if (req.params.id.length !== 24) {
    res.status(400).send({ error: 'Id needs to be a 24 character long hex string!' });
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
  if (req.params.id.length !== 24) {
    res.status(400).send({ error: 'Id needs to be a 24 character long hex string!' });
  } else {
    otherMachineCtrl.get(req.params.id).then((otherMachine) => {
      if (!otherMachine) {
        res.status(404).send({ error: `Other Machine by id '${req.params.id}' not found` });
      } else {
        res.json({ otherMachine });
      }
    }).catch((err) => {
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
    otherMachineCtrl.get(req.params.id).then((otherMachine) => {
      if (!otherMachine) {
        res.status(404).send({ error: `Other Machine by id '${req.params.id}' not found` });
      } else {
        otherMachineCtrl.update(req.params.id, req.body).then((otherMachine) => {
          res.json({ otherMachine });
        });
      }
    }).catch((err) => {
      res.status(400).send({ error: 'Malformed request!', stack: err });
    });
  }
});


export default router;
