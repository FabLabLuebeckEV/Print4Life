import * as express from 'express';
import * as multer from 'multer';
import orderCtrl from '../controllers/order.controller';

const router = express.Router();

const upload = multer();

router.route('/').post(orderCtrl.create);

router.route('/:id').put(orderCtrl.update);

router.route('/:id').delete(orderCtrl.deleteById);

router.route('/status/').get(orderCtrl.getStatus);

router.route('/:id/comment').post(orderCtrl.createComment);

router.route('/:id').get(orderCtrl.get);

router.route('/:id/files').post(upload.array('file'), orderCtrl.uploadFile);

router.route('/:id/files/:fileId').get(orderCtrl.downloadFile);

router.route('/:id/files/:fileId').delete(orderCtrl.deleteFile);

export default router;
