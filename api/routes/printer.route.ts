import * as express from 'express';
import printerCtrl from '../controllers/printer.controller';
import logger from '../logger';
import validatorService from '../services/validator.service';

const router = express.Router();

router.route('/').get((req, res) => {
  printerCtrl.getAll(req.query.limit, req.query.skip).then((printers) => {
    if ((printers && printers.length === 0) || !printers) {
      logger.info('GET Printers with no result');
      res.status(204).send();
    } else if (printers && req.query.limit && req.query.skip) {
      logger.info(`GET Printers with partial result ${JSON.stringify(printers)}`);
      res.status(206).send({ printers });
    } else if (printers) {
      logger.info(`GET Printers with result ${JSON.stringify(printers)}`);
      res.status(200).send({ printers });
    }
  }).catch((err) => {
    const msg = { error: 'Error while trying to get all printers', stack: err };
    logger.error(msg);
    res.status(500).send(msg);
  });
});

router.route('/count').get((req, res) => {
  printerCtrl.count().then((count) => {
    logger.info(`GET count printers with result ${JSON.stringify(count)}`);
    res.status(200).send({ count });
  }).catch((err) => {
    const msg = { error: 'Error while trying count all printers', stack: err };
    logger.error(msg);
    res.status(500).send(msg);
  });
});

router.route('/').post((req, res) => {
  printerCtrl.create(req.body).then((printer) => {
    logger.info(`POST Printers with result ${JSON.stringify(printer)}`);
    res.status(201).send({ printer });
  }).catch((err) => {
    const msg = { err: 'Malformed request!', stack: err };
    logger.error(msg);
    res.status(400).send(msg);
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
                logger.info(`DELETE Printer with result ${JSON.stringify(printer)}`);
                res.status(200).send({ printer });
              }
            }).catch((err) => {
              const msg = { err: `Error while trying to get the Printer by id ${req.params.id}`, stack: err };
              logger.error(msg);
              res.status(500).send(msg);
            });
          } else {
            const msg = { err: `Error while trying to delete the Printer with id ${req.params.id}` };
            logger.error(msg);
            res.status(500).send(msg);
          }
        }).catch((err) => {
          const msg = { err: 'Malformed request!', stack: err };
          logger.error(msg);
          res.status(400).send(msg);
        });
      } else {
        const msg = { err: `Printer by id ${req.params.id} not found!` };
        logger.error(msg);
        res.status(404).send(msg);
      }
    }).catch((err) => {
      const msg = { err: `Error while trying to get the Printer by id ${req.params.id}`, stack: err };
      logger.error(msg);
      res.status(500).send(msg);
    });
  }
});

router.route('/:id').get((req, res) => {
  const checkId = validatorService.checkId(req.params.id);
  if (checkId) {
    logger.error({ error: checkId.error });
    res.status(checkId.status).send({ error: checkId.error });
  } else {
    printerCtrl.get(req.params.id).then((printer) => {
      if (!printer) {
        const msg = { error: `Printer by id '${req.params.id}' not found` };
        logger.error(msg);
        res.status(404).send(msg);
      } else {
        logger.info(`GET Printer by Id with result ${JSON.stringify(printer)}`);
        res.status(200).send({ printer });
      }
    }).catch((err) => {
      const msg = { err: 'Malformed request!', stack: err };
      logger.error(msg);
      res.status(400).send(msg);
    });
  }
});

router.route('/:id').put((req, res) => {
  const checkId = validatorService.checkId(req.params.id);
  if (checkId) {
    logger.error({ error: checkId.error });
    res.status(checkId.status).send({ error: checkId.error });
  } else if (Object.keys(req.body).length === 0) {
    const msg = { error: 'No params to update given!' };
    logger.error(msg);
    res.status(400).send(msg);
  } else {
    printerCtrl.get(req.params.id).then((printer) => {
      if (!printer) {
        const msg = { error: `Printer by id '${req.params.id}' not found` };
        logger.error(msg);
        res.status(404).send(msg);
      } else {
        printerCtrl.update(req.params.id, req.body).then((printer) => {
          logger.info(`PUT Printer with result ${JSON.stringify(printer)}`);
          res.status(200).send({ printer });
        });
      }
    }).catch((err) => {
      const msg = { err: 'Malformed request!', stack: err };
      logger.error(msg);
      res.status(400).send(msg);
    });
  }
});

export default router;
