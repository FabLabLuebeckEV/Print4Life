import * as express from 'express';
import machineCtrl from '../controllers/machine.controller';
import printer3DRoute from './3d-printer.route';
import lasercutterRoute from '../routes/lasercutter.route';
import otherMachineRoute from '../routes/otherMachine.route';
import millingMachineRoute from '../routes/millingMachine.route';
import routerService from '../services/router.service';

const router = express.Router();

router.use((req, res, next) => routerService.jwtValid(req, res, next));

router.route('/').get(machineCtrl.getAllMachines);

router.route('/types').get(machineCtrl.getMachineTypes);

router.route('/materials/:machine').get(machineCtrl.getMaterialsByType);

router.use('/3d-printers/', printer3DRoute);
router.use('/millingMachines/', millingMachineRoute);
router.use('/otherMachines/', otherMachineRoute);
router.use('/lasercutters/', lasercutterRoute);

export default router;
