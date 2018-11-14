import machineService from './machine.service';

export class Printer3DService {
    machineType = '3d-printer';

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

    public deleteById (id) {
      return machineService.deleteById(this.machineType, id);
    }

    public get (id) {
      return machineService.get(this.machineType, id);
    }

    public update (id, machine) {
      return machineService.update(this.machineType, id, machine);
    }

    public count () {
      return machineService.count(this.machineType);
    }
}

export default Printer3DService;
