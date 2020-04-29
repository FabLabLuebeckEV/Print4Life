import * as express from 'express';
import serviceController from '../controllers/service.controller';
/*
import * as multer from 'multer';
import orderCtrl from '../controllers/order.controller';
import routerService from '../services/router.service';
import sharedRoute from './sharedOrders.route';
*/
const router = express.Router();

router.route('/contact').post(serviceController.contact);

export default router;
