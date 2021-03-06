import * as express from 'express';
import userCtrl from '../controllers/user.controller';
import routerService from '../services/router.service';

const router = express.Router();

router.use((req, res, next) => routerService.jwtValid(req, res, next));

router.route('/').post(userCtrl.create);

router.route('/:id').put(userCtrl.update);// ICH

router.route('/:id').delete(userCtrl.deleteById);// ICH

router.route('/search').post(userCtrl.search);// ADMIN

router.route('/count').post(userCtrl.count);// ADMIN

router.route('/roles').get(userCtrl.getRoles);

router.route('/languages').get(userCtrl.getLanguages);

router.route('/login').post(userCtrl.login);

router.route('/findown').get(userCtrl.findown);

router.route('/:id').get(userCtrl.get);// ADMIN // User

router.route('/:id/getNames').get(userCtrl.getNames);// ADMIN

router.route('/:id/activationRequest/').put(userCtrl.sendActivationRequest);

router.route('/resetPassword/').post(userCtrl.resetPassword);

router.route('/:id/changePassword').put(userCtrl.changePassword);// ICH

router.route('/:id/activate').put(userCtrl.activateUser);

export default router;
