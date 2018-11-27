import * as express from 'express';
import printer3DCtrl from '../controllers/3d-printer.controller';
import routerService from '../services/router.service';

const router = express.Router();

router.use((req, res, next) => routerService.jwtValid(req, res, next));

router.route('/').get(printer3DCtrl.getAll);

router.route('/count').get(printer3DCtrl.count);

router.route('/').post(printer3DCtrl.create);

router.route('/:id').delete(printer3DCtrl.deleteById);

router.route('/:id').get(printer3DCtrl.get);

router.route('/:id/countSuccessfulOrders').get(printer3DCtrl.countSuccessfulOrders);

router.route('/:id').put(printer3DCtrl.update);

export default router;
