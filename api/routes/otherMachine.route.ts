import * as express from 'express';
import otherMachineCtrl from '../controllers/otherMachine.controller';
import routerService from '../services/router.service';

const router = express.Router();

router.use((req, res, next) => routerService.jwtValid(req, res, next));

router.route('/').get(otherMachineCtrl.getAll);

router.route('/count').get(otherMachineCtrl.count);

router.route('/').post(otherMachineCtrl.create);

router.route('/:id').delete(otherMachineCtrl.deleteById);

router.route('/:id').get(otherMachineCtrl.get);

router.route('/:id/schedules').get(otherMachineCtrl.getSchedules);

router.route('/:id/countSuccessfulOrders').get(otherMachineCtrl.countSuccessfulOrders);

router.route('/:id').put(otherMachineCtrl.update);

export default router;
