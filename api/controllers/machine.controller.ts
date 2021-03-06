import { MachineService } from '../services/machine.service';
import { UserService } from '../services/user.service';
import logger from '../logger';

const machineService = new MachineService();
const userService = new UserService();
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
 * @apiPermission none
 */

function getAllMachines (req, res) {
  machineService.getAllMachines().then((machines) => {
    logger.info('Get all machines');
    res.status(200).send({ machines });
  }).catch((err) => {
    const msg = { error: 'Error while getting all machines', stack: err };
    logger.error(msg);
    res.status(500).send(msg);
  });
}

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
function getMachineTypes (req, res) {
  machineService.getMachineTypes().then((types) => {
    logger.info(`Get all machine types: ${types}`);
    res.status(200).send({ types });
  }).catch((err) => {
    const msg = { error: 'Error while getting all machine types', stack: err };
    logger.error(msg);
    res.status(500).send(msg);
  });
}

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
function getMaterialsByType (req, res) {
  if (!req.params.machine) {
    const msg = { error: 'No machine given' };
    logger.error(msg);
    res.status(400).send(msg);
  }

  machineService.getMachineTypes().then((types) => {
    let typeOk = false;
    Object.keys(types).forEach((type) => {
      const check = types[type].toLowerCase().replace(/ /g, '');
      if (check === req.params.machine.toLowerCase()) {
        typeOk = true;
      }
    });

    if (!typeOk) {
      const msg = { error: `Material by machine type '${req.params.machine}' not found` };
      logger.error(msg);
      res.status(404).send(msg);
    }

    machineService.getMaterialsByType(req.params.machine).then((materials) => {
      logger.info(`GET all machine materials: ${materials}`);
      res.status(200).send({ materials });
    }).catch((err) => {
      const msg = { error: 'Error while getting all machine types', stack: err };
      logger.error(msg);
      res.status(500).send(msg);
    });
  });
}

/**
 * Checks the user`s update permission for the given machine
 * Currently only checks for admin permissions, may be updated for local admins,
 * see #160
 *
 * @param tokenstring **validated** jwt token of logged in user (directly from header, unshortened)
 * @param type machine type to be updated (currently unused)
 * @param id id of machine that is to be updated
 *
 * Throws Error if no permission is granted
 */
async function checkUpdatePermissions (tokenstring:string, type:string, id:string):Promise<void> {
  const token = tokenstring.split('JWT')[1].trim();
  const user = await userService.getUserByToken(token);
  logger.info(`requesting permission to update ${type} with id ${id}`);
  if (user.role.role !== 'admin') {
    const msg = {
      err: 'FORBIDDEN',
      message: 'User can not update machines!'
    };

    throw new Error(JSON.stringify(msg));
  }
}

export default {
  getAllMachines, getMachineTypes, getMaterialsByType, checkUpdatePermissions
};
