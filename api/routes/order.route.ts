import * as express from 'express';
import * as multer from 'multer';
import orderCtrl from '../controllers/order.controller';
import routerService from '../services/router.service';
import sharedRoute from './sharedOrders.route';

const router = express.Router();

const upload = multer();

router.use('/shared/', sharedRoute);

router.use((req, res, next) => routerService.jwtValid(req, res, next));

router.route('/').get(orderCtrl.getAll);

router.route('/search').post(orderCtrl.search);

router.route('/count').post(orderCtrl.count);

router.route('/').post(orderCtrl.create);

router.route('/:id').put(orderCtrl.update);

router.route('/:id').delete(orderCtrl.deleteById);

router.route('/status/').get(orderCtrl.getStatus);

router.route('/status/outstanding').get(orderCtrl.getOutstandingStatus);

router.route('/:id/comment').post(orderCtrl.createComment);

router.route('/:id').get(orderCtrl.get);

router.route('/:id/upload').post(upload.array('file'), orderCtrl.uploadFile);

router.route('/:id/download/:fileId').get(orderCtrl.downloadFile);

export default router;
