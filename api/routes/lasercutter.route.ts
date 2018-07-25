import * as express from 'express';
import lasercutterCtrl from '../controllers/lasercutter.controller';

const router = express.Router();

router.route('/').get((req, res) => {
  lasercutterCtrl.getAll().then((lasercutters) => {
    res.json({ lasercutters });
  }).catch((err) => {
    res.status(500).send(err);
  });
});

router.route('/create').post((req, res) => {
  lasercutterCtrl.create(req.body).then((lasercutter) => {
    res.json({ lasercutter });
  }).catch((err) => {
    res.status(400).send({ err: 'Malformed request!', stack: err });
  });
});

export default router;
