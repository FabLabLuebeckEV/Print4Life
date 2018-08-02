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

router.route('/laserTypes').get((req, res) => {
  lasercutterCtrl.getLaserTypes().then((laserTypes) => {
    res.json({ laserTypes });
  }).catch((err) => {
    res.status(500).send(err);
  });
});

router.route('/create').post((req, res) => {
  lasercutterCtrl.create(req.body).then((lasercutter) => {
    res.status(201).send({ lasercutter });
  }).catch((err) => {
    res.status(400).send({ err: 'Malformed request!', stack: err });
  });
});

router.route('/:id').delete((req, res) => {
  if (req.params.id.length !== 24) {
    res.status(400).send({ error: 'Id needs to be a 24 character long hex string!' });
  } else {
    lasercutterCtrl.deleteById(req.params.id).then(() => {
      res.status(204).send();
    }).catch((err) => {
      res.status(400).send({ err: 'Malformed request!', stack: err });
    });
  }
});

router.route('/:id').get((req, res) => {
  if (req.params.id.length !== 24) {
    res.status(400).send({ error: 'Id needs to be a 24 character long hex string!' });
  } else {
    lasercutterCtrl.get(req.params.id).then((lasercutter) => {
      if (!lasercutter) {
        res.status(404).send({ error: `Printer by id '${req.params.id}' not found` });
      } else {
        res.json({ lasercutter });
      }
    }).catch((err) => {
      res.status(400).send({ err: 'Malformed request!', stack: err });
    });
  }
});

export default router;
