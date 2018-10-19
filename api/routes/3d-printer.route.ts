import * as express from 'express';
import printer3DCtrl from '../controllers/3d-printer.controller';
import logger from '../logger';
import validatorService from '../services/validator.service';

const router = express.Router();

router.route('/').get((req, res) => {
  printer3DCtrl.getAll(req.query.limit, req.query.skip).then((printers3d) => {
    if ((printers3d && printers3d.length === 0) || !printers3d) {
      logger.info('GET 3D Printers with no result');
      res.status(204).send();
    } else if (printers3d && req.query.limit && req.query.skip) {
      logger.info(`GET 3D Printers with partial result ${JSON.stringify(printers3d)}`);
      res.status(206).send({ printers3d });
    } else if (printers3d) {
      logger.info(`GET 3D Printers with result ${JSON.stringify(printers3d)}`);
      res.status(200).send({ printers3d });
    }
  }).catch((err) => {
    const msg = { error: 'Error while trying to get all printers', stack: err };
    logger.error(msg);
    res.status(500).send(msg);
  });
});

router.route('/count').get((req, res) => {
  printer3DCtrl.count().then((count) => {
    logger.info(`GET count 3D printers with result ${JSON.stringify(count)}`);
    res.status(200).send({ count });
  }).catch((err) => {
    const msg = { error: 'Error while trying count all 3D printers', stack: err };
    logger.error(msg);
    res.status(500).send(msg);
  });
});

router.route('/').post((req, res) => {
  printer3DCtrl.create(req.body).then((printer3d) => {
    logger.info(`POST 3D Printers with result ${JSON.stringify(printer3d)}`);
    res.status(201).send({ printer3d });
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
    let printer3d;
    printer3DCtrl.get(req.params.id).then((p) => {
      if (p) {
        printer3d = p;
        printer3DCtrl.deleteById(req.params.id).then((result) => {
          if (result) {
            printer3DCtrl.get(req.params.id).then((result) => {
              if (!result) {
                logger.info(`DELETE 3D Printer with result ${JSON.stringify(printer3d)}`);
                res.status(200).send({ printer3d });
              }
            }).catch((err) => {
              const msg = { err: `Error while trying to get the 3D Printer by id ${req.params.id}`, stack: err };
              logger.error(msg);
              res.status(500).send(msg);
            });
          } else {
            const msg = { err: `Error while trying to delete the 3D Printer with id ${req.params.id}` };
            logger.error(msg);
            res.status(500).send(msg);
          }
        }).catch((err) => {
          const msg = { err: 'Malformed request!', stack: err };
          logger.error(msg);
          res.status(400).send(msg);
        });
      } else {
        const msg = { err: `3D Printer by id ${req.params.id} not found!` };
        logger.error(msg);
        res.status(404).send(msg);
      }
    }).catch((err) => {
      const msg = { err: `Error while trying to get the 3D Printer by id ${req.params.id}`, stack: err };
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
    printer3DCtrl.get(req.params.id).then((printer3d) => {
      if (!printer3d) {
        const msg = { error: `3D Printer by id '${req.params.id}' not found` };
        logger.error(msg);
        res.status(404).send(msg);
      } else {
        logger.info(`GET 3D Printer by Id with result ${JSON.stringify(printer3d)}`);
        res.status(200).send({ printer3d });
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
    printer3DCtrl.get(req.params.id).then((printer3d) => {
      if (!printer3d) {
        const msg = { error: `3D Printer by id '${req.params.id}' not found` };
        logger.error(msg);
        res.status(404).send(msg);
      } else {
        printer3DCtrl.update(req.params.id, req.body).then((printer3d) => {
          logger.info(`PUT 3D Printer with result ${JSON.stringify(printer3d)}`);
          res.status(200).send({ printer3d });
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
