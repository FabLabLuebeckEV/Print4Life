import * as express from 'express';
import fablabCtrl from '../controllers/fablab.controller';

const router = express.Router();

router.route('/').get((req, res) => {
  fablabCtrl.getAll().then((fablabs) => {
    res.json({ fablabs });
  }).catch((err) => {
    res.status(500).send(err);
  });
});

router.route('/:id').get((req, res) => {
  if (req.params.id.length !== 24) {
    res.status(400).send({ error: 'Id needs to be a 24 character long hex string!' });
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
