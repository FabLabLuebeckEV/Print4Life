import * as express from 'express';
import hospitalCtrl from '../controllers/hospital.controller';
import routerService from '../services/router.service';

const router = express.Router();

router.use((req, res, next) => routerService.jwtValid(req, res, next));

// router.route('/').get(hospitalCtrl.getAll);

router.route('/:id').get(hospitalCtrl.get);// Login

router.route('/').post(hospitalCtrl.create);

router.route('/:id').put(hospitalCtrl.update);// Owner / ADMIN

router.route('/:id').delete(hospitalCtrl.deleteById);// Login admin

router.route('/:id/activate').put(hospitalCtrl.activate);// ADMIN

router.route('/search').post(hospitalCtrl.search);// Login

export default router;
