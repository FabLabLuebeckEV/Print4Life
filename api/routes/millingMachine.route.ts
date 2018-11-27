import * as express from 'express';
import millingMachineCtrl from '../controllers/millingMachine.controller';
import routerService from '../services/router.service';

const router = express.Router();

router.use((req, res, next) => routerService.jwtValid(req, res, next));

router.route('/').get(millingMachineCtrl.getAll);

router.route('/count').get(millingMachineCtrl.count);

router.route('/').post(millingMachineCtrl.create);

router.route('/:id').delete(millingMachineCtrl.deleteById);

router.route('/:id').get(millingMachineCtrl.get);

router.route('/:id/countSuccessfulOrders').get(millingMachineCtrl.countSuccessfulOrders);

router.route('/:id').put(millingMachineCtrl.update);

export default router;
