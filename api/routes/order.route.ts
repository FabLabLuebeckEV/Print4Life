import * as express from 'express';
import * as multer from 'multer';
import * as path from 'path';
import orderCtrl from '../controllers/order.controller';
import routerService from '../services/router.service';

const router = express.Router();

const DIR = './uploads';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}.${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

router.use((req, res, next) => routerService.jwtValid(req, res, next));

router.route('/').get(orderCtrl.getAll);

router.route('/search').post(orderCtrl.search);

router.route('/count').post(orderCtrl.count);

router.route('/').post(orderCtrl.create);

router.route('/:id/upload').post(upload.array('file'), orderCtrl.upload);

router.route('/:id').put(orderCtrl.update);

router.route('/:id').delete(orderCtrl.deleteById);

router.route('/status/').get(orderCtrl.getStatus);

router.route('/:id/comment').post(orderCtrl.createComment);

router.route('/:id').get(orderCtrl.get);

export default router;
