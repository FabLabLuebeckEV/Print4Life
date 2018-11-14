import { MachineService } from './machine.service';
/* eslint-disable no-unused-vars */
import ModelService from './model.service';
/* eslint-enable no-unused-vars */

export class Printer3DService implements ModelService {
  machineType = '3d-printer';

  machineService = new MachineService();

  /**
   * This method gets all 3d printers. The result can be limited as well as some items skipped
   * @param limit is the limit of items to get
   * @param skip is the amount of items to skip (counted from the beginning)
   * @returns a promise with the results
   */
  public getAll (limit?: string, skip?: string) {
    let l: Number;
    let s: Number;
    if (limit && skip) {
      l = Number.parseInt(limit, 10);
      s = Number.parseInt(skip, 10);
    }
    return this.machineService.getMachineType(this.machineType, l, s);
  }

  /**
   * This method creates a new 3d printer
   * @param params are the params for the 3d printer
   * @returns a promise with the results
   */
  public create (params) {
    return this.machineService.create(this.machineType, params);
  }

  /**
   * This method deletes a 3d printer by its id
   * @returns a promise with the result
   */
  public deleteById (id) {
    return this.machineService.deleteById(this.machineType, id);
  }

  /**
   * This method gets a 3d printer by its id
   * @param id is the id of the 3d printer
   * @returns a promise with the results
   */
  public get (id) {
    return this.machineService.get(this.machineType, id);
  }

  /**
   * This method updates a 3d printer
   * @param id is the id of the 3d printer
   * @param machine is the machine obj that updates the 3d printer
   * @returns a promise with the results
   */
  public update (id, machine) {
    return this.machineService.update(this.machineType, id, machine);
  }

  /**
   * This method counts all 3d printer
   * @returns a promise with the result
   */
  public count () {
    return this.machineService.count(this.machineType);
  }
}

export default Printer3DService;
