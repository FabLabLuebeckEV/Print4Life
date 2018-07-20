import * as express from 'express';
import machineCtrl from '../controllers/machine.controller';

const router = express.Router();

router.route('/').get((req, res) => {
  machineCtrl.getAllMachines().then((machines) => {
    res.json({ machines });
  }).catch((err) => {
    res.status(500).send(err);
  }).catch((err) => {
    res.status(500).send(err);
  });
});

router.route('/printer').get((req, res) => {
  machineCtrl.getPrinters().then((printers) => {
    res.json({ printers });
  }).catch((err) => {
    res.status(500).send(err);
  }).catch((err) => {
    res.status(500).send(err);
  });
});

router.route('/otherMachine').get((req, res) => {
  machineCtrl.getOtherMachines().then((otherMachines) => {
    res.json({ otherMachines });
  }).catch((err) => {
    res.status(500).send(err);
  }).catch((err) => {
    res.status(500).send(err);
  });
});

router.route('/lasercutter').get((req, res) => {
  machineCtrl.getLasercutters().then((lasercutters) => {
    res.json({ lasercutters });
  }).catch((err) => {
    res.status(500).send(err);
  }).catch((err) => {
    res.status(500).send(err);
  });
});

router.route('/millingMachine').get((req, res) => {
  machineCtrl.getMillingMachines().then((millingMachines) => {
    res.json({ millingMachines });
  }).catch((err) => {
    res.status(500).send(err);
  }).catch((err) => {
    res.status(500).send(err);
  });
});

export default router;
