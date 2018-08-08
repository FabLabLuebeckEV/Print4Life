import * as express from 'express';
import printerCtrl from '../controllers/printer.controller';
import logger from '../logger';

const router = express.Router();

router.route('/').get((req, res) => {
  printerCtrl.getAll().then((printers) => {
    res.json({ printers });
  }).catch((err) => {
    res.status(500).send(err);
  });
});

router.route('/').post((req, res) => {
  printerCtrl.create(req.body).then((printer) => {
    res.status(201).send({ printer });
  }).catch((err) => {
    res.status(400).send({ err: 'Malformed request!', stack: err });
  });
});

router.route('/:id').delete((req, res) => {
  if (req.params.id.length !== 24) {
    res.status(400).send({ error: 'Id needs to be a 24 character long hex string!' });
  } else {
    let printer;
    printerCtrl.get(req.params.id).then((p) => {
      if (p) {
        printer = p;
        printerCtrl.deleteById(req.params.id).then((result) => {
          if (result) {
            printerCtrl.get(req.params.id).then((result) => {
              if (!result) {
                res.status(200).send({ printer });
              }
            }).catch((err) => {
              logger.error(err);
              res.status(500).send({ err: `Error while trying to get the Printer by id ${req.params.id}`, stack: err });
            });
          } else {
            res.status(500).send({ err: `Error while trying to delete the Printer with id ${req.params.id}` });
          }
        }).catch((err) => {
          logger.error(err);
          res.status(400).send({ err: 'Malformed request!', stack: err });
        });
      } else {
        logger.error(`Printer by id ${req.params.id} not found!`);
        res.status(404).send({ err: `Printer by id ${req.params.id} not found!` });
      }
    }).catch((err) => {
      logger.error(err);
      res.status(500).send({ err: `Error while trying to get the Printer by id ${req.params.id}`, stack: err });
    });
  }
});

router.route('/:id').get((req, res) => {
  if (req.params.id.length !== 24) {
    res.status(400).send({ error: 'Id needs to be a 24 character long hex string!' });
  } else {
    printerCtrl.get(req.params.id).then((printer) => {
      if (!printer) {
        res.status(404).send({ error: `Printer by id '${req.params.id}' not found` });
      } else {
        res.status(200).send({ printer });
      }
    }).catch((err) => {
      res.status(400).send({ err: 'Malformed request!', stack: err });
    });
  }
});

router.route('/:id').put((req, res) => {
  if (req.params.id.length !== 24) {
    res.status(400).send({ error: 'Id needs to be a 24 character long hex string!' });
  } else if (Object.keys(req.body).length === 0) {
    res.status(400).send({ error: 'No params to update given!' });
  } else {
    printerCtrl.get(req.params.id).then((printer) => {
      if (!printer) {
        res.status(404).send({ error: `Printer by id '${req.params.id}' not found` });
      } else {
        printerCtrl.update(req.params.id, req.body).then((printer) => {
          res.json({ printer });
        });
      }
    }).catch((err) => {
      res.status(400).send({ err: 'Malformed request!', stack: err });
    });
  }
});

export default router;
