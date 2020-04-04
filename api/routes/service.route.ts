import * as express from 'express';
import * as multer from 'multer';
import orderCtrl from '../controllers/order.controller';
import routerService from '../services/router.service';
import sharedRoute from './sharedOrders.route';

const router = express.Router();

export default router;