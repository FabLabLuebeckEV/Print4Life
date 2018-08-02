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


export default router;
