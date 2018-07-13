import * as express from 'express';
import transformCtrl from '../controllers/transform.controller';

const router = express.Router();

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
