import * as express from 'express';
import printerCtrl from '../controllers/printer.controller';
import logger from '../logger';
import validatorService from '../services/validator.service';

const router = express.Router();

router.route('/').get((req, res) => {
  printerCtrl.getAll(req.query.limit, req.query.skip).then((printers) => {
    if (printers && printers.length === 0) {
      res.status(204).send();
    } else if (printers) {
      res.status(200).send({ printers });
    }
  }).catch((err) => {
    logger.error(err);
    res.status(500).send(err);
  });
});

router.route('/count').get((req, res) => {
  printerCtrl.count().then((count) => {
    res.status(200).send({ count });
  }).catch((err) => {
    logger.error(err);
    res.status(500).send(err);
  });
});

router.route('/').post((req, res) => {
  printerCtrl.create(req.body).then((printer) => {
    res.status(201).send({ printer });
  }).catch((err) => {
    logger.error(err);
    res.status(400).send({ err: 'Malformed request!', stack: err });
  });
});

router.route('/:id').delete((req, res) => {
  const checkId = validatorService.checkId(req.params.id);
  if (checkId) {
    res.status(checkId.status).send({ error: checkId.error });
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
  const checkId = validatorService.checkId(req.params.id);
  if (checkId) {
    res.status(checkId.status).send({ error: checkId.error });
  } else {
    printerCtrl.get(req.params.id).then((printer) => {
      if (!printer) {
        res.status(404).send({ error: `Printer by id '${req.params.id}' not found` });
      } else {
        res.status(200).send({ printer });
      }
    }).catch((err) => {
      logger.error(err);
      res.status(400).send({ err: 'Malformed request!', stack: err });
    });
  }
});

router.route('/:id').put((req, res) => {
  const checkId = validatorService.checkId(req.params.id);
  if (checkId) {
    res.status(checkId.status).send({ error: checkId.error });
  } else if (Object.keys(req.body).length === 0) {
    res.status(400).send({ error: 'No params to update given!' });
  } else {
    printerCtrl.get(req.params.id).then((printer) => {
      if (!printer) {
        res.status(404).send({ error: `Printer by id '${req.params.id}' not found` });
      } else {
        printerCtrl.update(req.params.id, req.body).then((printer) => {
          res.status(200).send({ printer });
        });
      }
    }).catch((err) => {
      logger.error(err);
      res.status(400).send({ err: 'Malformed request!', stack: err });
    });
  }
});

export default router;
