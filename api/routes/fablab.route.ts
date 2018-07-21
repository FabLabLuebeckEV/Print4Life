import * as express from 'express';
import fablabCtrl from '../controllers/fablab.controller';

const router = express.Router();

router.route('/:id').get((req, res) => {
  if (isNaN(req.params.id) || req.params.id < 0) {
    res.status(400).send({ error: 'Id needs to be a positive number!' });
  } else {
    fablabCtrl.getFablab(req.params.id).then((fablab) => {
      if (!fablab) {
        res.status(404).send({ error: `Fablab by id '${req.params.id}' not found` });
      } else {
        res.json({ fablab });
      }
    }).catch((err) => {
      res.status(500).send(err);
    });
  }
});

export default router;
