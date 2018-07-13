import * as express from 'express';
import machineCtrl from '../controllers/machine.controller';

const router = express.Router();

router.route('/printer').get((req, res) => {
  machineCtrl.getPrinters().then((printers) => {
    res.json({ printers });
  }).catch((err) => {
    res.error(err);
  }).catch((err) => {
    res.status(500).send(err);
  });
});

export default router;
