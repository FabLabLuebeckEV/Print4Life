import MachineService from './machine.service';
/* eslint-disable no-unused-vars */
import ModelService from './model.service';
/* eslint-enable no-unused-vars */
export class OtherMachineService implements ModelService {
  machineType = 'otherMachine';

  machineService = new MachineService();

  /**
    * This method gets all other machines. The result can be limited as well as some items skipped
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
   * This method creates a new other machine
   * @param params are the params for the other machine
   * @returns a promise with the results
   */
  public create (params) {
    return this.machineService.create(this.machineType, params);
  }

  /**
   * This method gets a other machine by its id
     * @param id is the id of the other machine
     * @returns a promise with the results
     */
  public get (id) {
    return this.machineService.get(this.machineType, id);
  }

  /**
  * This method deletes a other machine by its id
  * @returns a promise with the result
  */
  public deleteById (id) {
    return this.machineService.deleteById(this.machineType, id);
  }

  /**
    * This method updates a other machine
    * @param id is the id of the other machine
    * @param machine is the machine obj that updates the other machine
    * @returns a promise with the results
    */
  public update (id, machine) {
    return this.machineService.update(this.machineType, id, machine);
  }

  /**
    * This method counts all other machines
    * @returns a promise with the result
    */
  public count () {
    return this.machineService.count(this.machineType);
  }
}

export default OtherMachineService;
