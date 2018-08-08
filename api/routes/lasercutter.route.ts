import * as express from 'express';
import lasercutterCtrl from '../controllers/lasercutter.controller';
import logger from '../logger';

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

router.route('/').post((req, res) => {
  lasercutterCtrl.create(req.body).then((lasercutter) => {
    res.status(201).send({ lasercutter });
  }).catch((err) => {
    res.status(400).send({ error: 'Malformed request!', stack: err });
  });
});

router.route('/:id').delete((req, res) => {
  if (req.params.id.length !== 24) {
    res.status(400).send({ error: 'Id needs to be a 24 character long hex string!' });
  } else {
    let lasercutter;
    lasercutterCtrl.get(req.params.id).then((l) => {
      if (l) {
        lasercutter = l;
        lasercutterCtrl.deleteById(req.params.id).then((result) => {
          if (result) {
            lasercutterCtrl.get(req.params.id).then((result) => {
              if (!result) {
                res.status(200).send({ lasercutter });
              }
            }).catch((err) => {
              logger.error(err);
              res.status(500).send(
                {
                  err: `Error while trying to get the Lasercutter by id ${req.params.id}`,
                  stack: err
                }
              );
            });
          } else {
            res.status(500).send({ error: `Error while trying to delete the Lasercutter with id ${req.params.id}` });
          }
        }).catch((err) => {
          logger.error(err);
          res.status(400).send({ error: 'Malformed request!', stack: err });
        });
      } else {
        logger.error(`Lasercutter by id ${req.params.id} not found!`);
        res.status(404).send({ error: `Lasercutter by id ${req.params.id} not found!` });
      }
    }).catch((err) => {
      logger.error(err);
      res.status(500).send({ error: `Error while trying to get the Lasercutter by id ${req.params.id}`, stack: err });
    });
  }
});

router.route('/:id').get((req, res) => {
  if (req.params.id.length !== 24) {
    res.status(400).send({ error: 'Id needs to be a 24 character long hex string!' });
  } else {
    lasercutterCtrl.get(req.params.id).then((lasercutter) => {
      if (!lasercutter) {
        res.status(404).send({ error: `Lasercutter by id '${req.params.id}' not found` });
      } else {
        res.json({ lasercutter });
      }
    }).catch((err) => {
      res.status(400).send({ error: 'Malformed request!', stack: err });
    });
  }
});

router.route('/:id').put((req, res) => {
  if (req.params.id.length !== 24) {
    res.status(400).send({ error: 'Id needs to be a 24 character long hex string!' });
  } else if (Object.keys(req.body).length === 0) {
    res.status(400).send({ error: 'No params to update given!' });
  } else {
    lasercutterCtrl.get(req.params.id).then((lasercutter) => {
      if (!lasercutter) {
        res.status(404).send({ error: `Lasercutter by id '${req.params.id}' not found` });
      } else {
        lasercutterCtrl.update(req.params.id, req.body).then((lasercutter) => {
          res.status(200).send({ lasercutter });
        });
      }
    }).catch((err) => {
      res.status(400).send({ error: 'Malformed request!', stack: err });
    });
  }
});

export default router;
