import * as express from 'express';
import machineCtrl from '../controllers/machine.controller';
import printerRoute from '../routes/printer.route';
import lasercutterRoute from '../routes/lasercutter.route';
import otherMachineRoute from '../routes/otherMachine.route';
import millingMachineRoute from '../routes/millingMachine.route';

const router = express.Router();

router.route('/').get((req, res) => {
  machineCtrl.getAllMachines().then((machines) => {
    res.json({ machines });
  }).catch((err) => {
    res.status(500).send(err);
  });
});

router.use('/printer/', printerRoute);
router.use('/millingMachine/', millingMachineRoute);
router.use('/otherMachine/', otherMachineRoute);
router.use('/lasercutter/', lasercutterRoute);

export default router;
