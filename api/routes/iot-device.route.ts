import * as express from 'express';
import iotDeviceCtrl from '../controllers/iot-device.controller';
import routerService from '../services/router.service';

const router = express.Router();

router.use((req, res, next) => routerService.jwtValid(req, res, next));

router.route('/types').get(iotDeviceCtrl.getDeviceTypes);

router.route('/').post(iotDeviceCtrl.create);

router.route('/').get(iotDeviceCtrl.getAll);

router.route('/:id').get(iotDeviceCtrl.get);

router.route('/:id').delete(iotDeviceCtrl.deleteById);

router.route('/search').post(iotDeviceCtrl.search);

export default router;
