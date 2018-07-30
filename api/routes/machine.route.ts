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

router.route('/types').get((req, res) => {
  machineCtrl.getMachineTypes().then((types) => {
    res.json({ types });
  }).catch((err) => {
    res.status(500).send(err);
  });
});

router.route('/materials/:machine').get((req, res) => {
  if (!req.params.machine) {
    res.status(400).send({ error: 'No machine given' });
  }

  machineCtrl.getMachineTypes().then((types) => {
    let typeOk = false;
    Object.keys(types).forEach((type) => {
      const check = types[type].toLowerCase().replace(/ /g, '');
      if (check === req.params.machine.toLowerCase()) {
        typeOk = true;
      }
    });

    if (!typeOk) {
      res.status(404).send({ error: `Material by machine type '${req.params.machine}' not found` });
    }

    machineCtrl.getMaterialsByType(req.params.machine).then((materials) => {
      res.json({ materials });
    }).catch((err) => {
      res.status(500).send(err);
    });
  });
});

router.use('/printers/', printerRoute);
router.use('/millingMachines/', millingMachineRoute);
router.use('/otherMachines/', otherMachineRoute);
router.use('/lasercutters/', lasercutterRoute);

export default router;
