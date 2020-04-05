import * as express from 'express';
import blueprintCtrl from '../controllers/blueprint.controller';

const router = express.Router();


router.route('/').get(blueprintCtrl.getAll);

export default router;
