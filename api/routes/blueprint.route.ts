import * as express from 'express';
import blueprintCtrl from '../controllers/blueprint.controller';

const router = express.Router();


router.route('/').get(blueprintCtrl.getAll);
router.route('/:id').get(blueprintCtrl.get);

export default router;
