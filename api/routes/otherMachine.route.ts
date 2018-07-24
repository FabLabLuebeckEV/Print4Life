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

export default router;
