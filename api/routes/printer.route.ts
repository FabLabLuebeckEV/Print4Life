import * as express from 'express';
import printerCtrl from '../controllers/printer.controller';

const router = express.Router();

router.route('/').get((req, res) => {
  printerCtrl.getAll().then((printers) => {
    res.json({ printers });
  }).catch((err) => {
    res.status(500).send(err);
  });
});

router.route('/create').post((req, res) => {
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
    printerCtrl.deleteById(req.params.id).then(() => {
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
    printerCtrl.get(req.params.id).then((printer) => {
      if (!printer) {
        res.status(404).send({ error: `Printer by id '${req.params.id}' not found` });
      } else {
        res.json({ printer });
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
