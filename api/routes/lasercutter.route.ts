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

export default router;
