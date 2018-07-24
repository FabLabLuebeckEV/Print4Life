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
        res.json({ printer });
    }).catch(() => {
        res.status(400).send({ err: 'Malformed request!' });
    });
});

export default router;
