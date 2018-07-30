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
    res.json({ millingMachine });
  }).catch((err) => {
    res.status(400).send({ err: 'Malformed request!', stack: err });
  });
});

export default router;
