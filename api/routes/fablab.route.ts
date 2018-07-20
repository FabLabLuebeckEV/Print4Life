import * as express from 'express';
import fablabCtrl from '../controllers/fablab.controller';

const router = express.Router();

router.route('/').get((req, res) => {
  fablabCtrl.getFablab(req.query.id).then((fablab) => {
    res.json({ fablab });
  }).catch((err) => {
    res.status(500).send(err);
  }).catch((err) => {
    res.status(500).send(err);
  });
});

export default router;
