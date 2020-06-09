import * as express from 'express';
// import * as multer from 'multer';
import orderCtrl from '../controllers/order.controller';
import routerService from '../services/router.service';
// import sharedRoute from './sharedOrders.route';

const router = express.Router();

// const upload = multer();

// router.use('/shared/', sharedRoute);

router.use((req, res, next) => routerService.jwtValid(req, res, next));

router.route('/').get(orderCtrl.getAll);// Logedin

router.route('/search').post(orderCtrl.search);// Logedin

router.route('/count').post(orderCtrl.count);// Logedin

router.route('/').post(orderCtrl.create);// role.role = USER

router.route('/:id').put(orderCtrl.update);// Owner

router.route('/:id').delete(orderCtrl.deleteById);// Owner

router.route('/status/').get(orderCtrl.getStatus);// Logedin

// router.route('/status/outstanding').get(orderCtrl.getOutstandingStatus);

router.route('/:id/comment').post(orderCtrl.createComment);// Logedin

router.route('/:id').get(orderCtrl.get);// Logedin

// router.route('/:id/files').post(upload.array('file'), orderCtrl.uploadFile);// Logedin

// router.route('/:id/schedule').get(orderCtrl.getSchedule);

// router.route('/:id/files/:fileId').get(orderCtrl.downloadFile);

// router.route('/:id/files/:fileId').delete(orderCtrl.deleteFile);

export default router;
