import * as express from 'express';
import machineCtrl from '../controllers/machine.controller';
import printerRoute from '../routes/printer.route';
import lasercutterRoute from '../routes/lasercutter.route';
import otherMachineRoute from '../routes/otherMachine.route';
import millingMachineRoute from '../routes/millingMachine.route';
import routerService from '../services/router.service';

const router = express.Router();

router.use((req, res, next) => routerService.jwtValid(req, res, next));

/**
 * @api {get} /api/v1/machines/ Get all machines
 * @apiName GetMachines
 * @apiVersion 1.0.0
 * @apiGroup Machines
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiSuccess {Array} machines an array of an array of machine objects
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "machines": {
        "printers": [
            {
                "_id": "5b51c25c1058dc2189272733",
                "fablabId": 2,
                "type": "printer",
                "deviceName": "Dimension Elite",
                "manufacturer": "Stratasys",
                "materials": [],
                "camSoftware": "",
                "printVolumeX": 203,
                "printVolumeY": 203,
                "printVolumeZ": 305,
                "printResolutionX": 0.1,
                "printResolutionY": 0.1,
                "printResolutionZ": 1.75,
                "nozzleDiameter": 0.4,
                "numberOfExtruders": 2,
                "comment": "Dissolvable support (acidbath)\n",
                "__v": 0
            }
        ],
        "lasercutters": [
            {
                "_id": "5b51c25c1058dc2189272724",
                "fablabId": 2,
                "type": "lasercutter",
                "deviceName": "Helix",
                "manufacturer": "Epilog",
                "laserTypes": [
                    {
                        "_id": "5b51c25c1058dc2189272723",
                        "laserType": "CO2",
                        "id": 1
                    }
                ],
                "camSoftware": "",
                "workspaceX": 600,
                "workspaceY": 450,
                "workspaceZ": 350,
                "laserPower": "40",
                "comment": "",
                "__v": 0
            }
        ],
        "millingMachines": [
            {
                "_id": "5b51c25c1058dc218927272e",
                "fablabId": 3,
                "type": "millingMachine",
                "deviceName": "High-Z S-720T",
                "manufacturer": "CNC-Step",
                "camSoftware": "",
                "workspaceX": 720,
                "workspaceY": 420,
                "workspaceZ": 110,
                "movementSpeed": 0,
                "stepSize": null,
                "comment": "",
                "__v": 0
            }
        ],
        "otherMachines": [
            {
                "_id": "5b51c25c1058dc218927273e",
                "fablabId": 2,
                "type": "otherMachine",
                "deviceName": "Sign Maker BN-20",
                "manufacturer": "Roland",
                "typeOfMachine": "Cutting Plotter",
                "comment": "",
                "__v": 0
            }
        ]
    }
}
 */

router.route('/').get((req, res) => {
  machineCtrl.getAllMachines().then((machines) => {
    res.json({ machines });
  }).catch((err) => {
    res.status(500).send(err);
  });
});

/**
 * @api {get} /api/v1/machines/types Get all machine types
 * @apiName GetMachineTypes
 * @apiVersion 1.0.0
 * @apiGroup Machines
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiSuccess {Array} types an array of strings giving information about the machine types
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "types": [
        "Lasercutter",
        "Milling Machine",
        "Other Machine",
        "Printer"
    ]
}
 */
router.route('/types').get((req, res) => {
  machineCtrl.getMachineTypes().then((types) => {
    res.json({ types });
  }).catch((err) => {
    res.status(500).send(err);
  });
});

/**
 * @api {get} /api/v1/machines/materials/:machine Get materials per machine type
 * @apiName GetMaterialsByType
 * @apiVersion 1.0.0
 * @apiGroup Materials
 * @apiHeader (Needed Request Headers) {String} Content-Type application/json
 *
 * @apiParam {String} machine is the name of the machine type
 * @apiSuccess {Array} materials an array of materials for a given machine type
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
{
    "types": [
        "Lasercutter",
        "Milling Machine",
        "Other Machine",
        "Printer"
    ]
}
 */
router.route('/materials/:machine').get((req, res) => {
  if (!req.params.machine) {
    res.status(400).send({ error: 'No machine given' });
  }

  machineCtrl.getMachineTypes().then((types) => {
    let typeOk = false;
    Object.keys(types).forEach((type) => {
      const check = types[type].toLowerCase().replace(/ /g, '');
      if (check === req.params.machine.toLowerCase()) {
        typeOk = true;
      }
    });

    if (!typeOk) {
      res.status(404).send({ error: `Material by machine type '${req.params.machine}' not found` });
    }

    machineCtrl.getMaterialsByType(req.params.machine).then((materials) => {
      res.json({ materials });
    }).catch((err) => {
      res.status(500).send(err);
    });
  });
});

router.use('/printers/', printerRoute);
router.use('/millingMachines/', millingMachineRoute);
router.use('/otherMachines/', otherMachineRoute);
router.use('/lasercutters/', lasercutterRoute);

export default router;
