import * as express from 'express';
import fablabCtrl from '../controllers/fablab.controller';
import routerService from '../services/router.service';

const router = express.Router();

router.use((req, res, next) => routerService.jwtValid(req, res, next));

router.route('/').get(fablabCtrl.getAll);

router.route('/:id').get(fablabCtrl.get);

router.route('/').post(fablabCtrl.create);

router.route('/:id').put(fablabCtrl.update);

router.route('/:id').delete(fablabCtrl.deleteById);

export default router;
