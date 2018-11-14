import machineService from '../services/machine.service';
import { LaserType } from '../models/lasertype.model';

export class LasercutterService {
    machineType = 'lasercutter';

    public getAll (limit?: string, skip?: string) {
      let l: Number;
      let s: Number;
      if (limit && skip) {
        l = Number.parseInt(limit, 10);
        s = Number.parseInt(skip, 10);
      }
      return machineService.getMachineType(this.machineType, l, s);
    }

    public create (params) {
      return machineService.create(this.machineType, params);
    }

    /* eslint-disable class-methods-use-this */
    public getLaserTypes () {
      return LaserType.find();
    }
    /* eslint-enable class-methods-use-this */

    public get (id) {
      return machineService.get(this.machineType, id);
    }

    public deleteById (id) {
      return machineService.deleteById(this.machineType, id);
    }

    public update (id, machine) {
      return machineService.update(this.machineType, id, machine);
    }

    public count () {
      return machineService.count(this.machineType);
    }
}

export default LasercutterService;
