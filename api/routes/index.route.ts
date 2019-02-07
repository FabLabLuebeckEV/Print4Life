import * as express from 'express';
import machineRoute from './machine.route';
import orderRoute from './order.route';
import usersRoute from './user.route';
import fablabRoute from './fablab.route';
import scheduleRoute from './schedule.route';
import statisticRoute from './statistic.route';
import iotDeviceRoute from './iot-device.route';
import octoprintRoute from './octoprint.route';

const router = express.Router();

/**
 * @api {get} /api/v1/version Get version number of the software
 * @apiName GetVersion
 * @apiVersion 1.0.0
 * @apiGroup Version
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiSuccess {Object} version number
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
  "version": "0.2.0"
}
 */
router.get('/version', (req, res) => {
  res.send({ version: process.env.npm_package_version });
});

router.use('/machines/', machineRoute);
router.use('/orders/', orderRoute);
router.use('/users/', usersRoute);
router.use('/fablabs/', fablabRoute);
router.use('/schedules/', scheduleRoute);
router.use('/statistics/', statisticRoute);
router.use('/iot-devices/', iotDeviceRoute);
router.use('/octoprint/', octoprintRoute);

export default router;
