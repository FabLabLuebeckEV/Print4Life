import * as express from 'express';
import otherMachineCtrl from '../controllers/otherMachine.controller';

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
    res.status(400).send({ err: 'Malformed request!', stack: err });
  });
});

router.route('/:id').delete((req, res) => {
  if (req.params.id.length !== 24) {
    res.status(400).send({ error: 'Id needs to be a 24 character long hex string!' });
  } else {
    otherMachineCtrl.deleteById(req.params.id).then(() => {
      res.status(204).send();
    }).catch((err) => {
      res.status(400).send({ err: 'Malformed request!', stack: err });
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
      res.status(400).send({ err: 'Malformed request!', stack: err });
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
      res.status(400).send({ err: 'Malformed request!', stack: err });
    });
  }
});


export default router;
