import * as express from 'express';
import transformCtrl from '../controllers/transform.controller';
import logger from '../logger';

const router = express.Router();

router.route('/').get((req, res) => {
  transformCtrl.transformLaserTypes().then(() => {
    transformCtrl.transformLaserCutters().then(() => {
      logger.info('Transformation of lasercutters done');
      transformCtrl.transformPrinterMaterial().then(() => {
        transformCtrl.transformPrinters().then(() => {
          logger.info('Transformation of printers done');
          transformCtrl.transformMillingMachine().then(() => {
            logger.info('Transformation of milling machines done');
            transformCtrl.transformOthers().then(() => {
              logger.info('Transformation of others done');
              res.json({ msg: 'Transformation of everything done' });
            }).catch((err) => {
              res.status(500).send(err);
            });
          }).catch((err) => {
            res.status(500).send(err);
          });
        }).catch((err) => {
          res.status(500).send(err);
        });
      }).catch((err) => {
        res.status(500).send(err);
      });
    }).catch((err) => {
      res.status(500).send(err);
    });
  }).catch((err) => {
    res.status(500).send(err);
  });
});

router.route('/lasercutter').get((req, res) => {
  transformCtrl.transformLaserTypes().then(() => {
    transformCtrl.transformLaserCutters().then(() => {
      res.json({ msg: 'Transformation of lasercutters done' });
    }).catch((err) => {
      res.status(500).send(err);
    });
  }).catch((err) => {
    res.status(500).send(err);
  });
});

router.route('/printer').get((req, res) => {
  transformCtrl.transformPrinterMaterial().then(() => {
    transformCtrl.transformPrinters().then(() => {
      res.json({ msg: 'Transformation of printers done' });
    }).catch((err) => {
      res.status(500).send(err);
    });
  }).catch((err) => {
    res.status(500).send(err);
  });
});

router.route('/milling').get((req, res) => {
  transformCtrl.transformMillingMachine().then(() => {
    res.json({ msg: 'Transformation of milling machines done' });
  }).catch((err) => {
    res.status(500).send(err);
  });
});

router.route('/other').get((req, res) => {
  transformCtrl.transformOthers().then(() => {
    res.json({ msg: 'Transformation of others done' });
  }).catch((err) => {
    res.status(500).send(err);
  });
});

router.route('/cleanDocuments').get((req, res) => {
  transformCtrl.cleanDocuments().then((updated) => {
    res.json({ updated });
  }).catch((err) => {
    res.status(500).send(err);
  });
});

export default router;
