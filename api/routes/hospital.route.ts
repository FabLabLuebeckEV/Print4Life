import * as express from 'express';
import hospitalCtrl from '../controllers/hospital.controller';
import routerService from '../services/router.service';

const router = express.Router();

router.use((req, res, next) => routerService.jwtValid(req, res, next));

router.route('/').get(hospitalCtrl.getAll);

router.route('/:id').get(hospitalCtrl.get);

router.route('/').post(hospitalCtrl.create);

router.route('/:id').put(hospitalCtrl.update);

router.route('/:id').delete(hospitalCtrl.deleteById);

router.route('/:id/activate').put(hospitalCtrl.activate);

router.route('/search').post(hospitalCtrl.search);

export default router;
