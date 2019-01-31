import * as express from 'express';
import octoprintCtrl from '../controllers/octoprint.controller';
import routerService from '../services/router.service';

const router = express.Router();

router.use((req, res, next) => routerService.jwtValid(req, res, next));

router.route('/uploadFile/:id').post(octoprintCtrl.uploadFile);

router.route('/print/:id').post(octoprintCtrl.startPrint);

export default router;
