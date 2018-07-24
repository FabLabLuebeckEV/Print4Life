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

export default router;
