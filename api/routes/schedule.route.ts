import * as express from 'express';
import routerService from '../services/router.service';
import schedulerCtrl from '../controllers/schedule.controller';

const router = express.Router();

router.use((req, res, next) => routerService.jwtValid(req, res, next));

router.route('/').get(schedulerCtrl.getAll);

router.route('/:id').get(schedulerCtrl.get);

router.route('/').post(schedulerCtrl.create);

router.route('/:id').put(schedulerCtrl.update);

router.route('/:id').delete(schedulerCtrl.deleteById);

export default router;
