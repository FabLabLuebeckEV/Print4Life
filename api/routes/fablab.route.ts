import * as express from 'express';
import fablabCtrl from '../controllers/fablab.controller';

const router = express.Router();

router.route('/:id').get((req, res) => {
  fablabCtrl.getFablab(req.params.id).then((fablab) => {
    res.json({ fablab });
  }).catch((err) => {
    res.status(500).send(err);
  }).catch((err) => {
    res.status(500).send(err);
  });
});

export default router;
