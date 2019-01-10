import * as express from 'express';
import statisticCtrl from '../controllers/statistic.controller';
import routerService from '../services/router.service';

const router = express.Router();

router.use((req, res, next) => routerService.jwtValid(req, res, next));

router.route('/ordersByDate').post(statisticCtrl.getOrdersByDate);

// router.route('/search').post(statisticCtrl.search);

export default router;
