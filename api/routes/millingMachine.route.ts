import * as express from 'express';
import millingMachineCtrl from '../controllers/millingMachine.controller';

const router = express.Router();

router.route('/').get((req, res) => {
  millingMachineCtrl.getAll().then((millingMachines) => {
    res.json({ millingMachines });
  }).catch((err) => {
    res.status(500).send(err);
  });
});

router.route('/create').post((req, res) => {
  millingMachineCtrl.create(req.body).then((millingMachine) => {
    res.status(201).send({ millingMachine });
  }).catch((err) => {
    res.status(400).send({ err: 'Malformed request!', stack: err });
  });
});

router.route('/:id').delete((req, res) => {
  if (req.params.id.length !== 24) {
    res.status(400).send({ error: 'Id needs to be a 24 character long hex string!' });
  } else {
    millingMachineCtrl.deleteById(req.params.id).then(() => {
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
    millingMachineCtrl.get(req.params.id).then((millingMachine) => {
      if (!millingMachine) {
        res.status(404).send({ error: `Milling Machine by id '${req.params.id}' not found` });
      } else {
        res.json({ millingMachine });
      }
    }).catch((err) => {
      res.status(400).send({ err: 'Malformed request!', stack: err });
    });
  }
});

export default router;
