import * as express from 'express';
import lasercutterCtrl from '../controllers/lasercutter.controller';
import routerService from '../services/router.service';

const router = express.Router();

router.use((req, res, next) => routerService.jwtValid(req, res, next));

router.route('/').get(lasercutterCtrl.getAll);

router.route('/count').get(lasercutterCtrl.count);

router.route('/laserTypes').get(lasercutterCtrl.getLaserTypes);

router.route('/').post(lasercutterCtrl.create);

router.route('/:id').delete(lasercutterCtrl.deleteById);

router.route('/:id').get(lasercutterCtrl.get);

router.route('/:id').put(lasercutterCtrl.update);

export default router;
