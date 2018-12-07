import * as fs from 'fs';
import { Printer3D } from '../models/machines/3d-printer.model';
import { Other } from '../models/machines/other.machine.model';
import { MillingMachine } from '../models/machines/milling.machine.model';
import { Lasercutter } from '../models/machines/lasercutter.model';
/* eslint-disable no-unused-vars */
import { IError, ErrorType } from './router.service';
/* eslint-enable no-unused-vars */
import materialService from '../services/material.service';
import OrderService from './order.service';
import ScheduleService from './schedule.service';

const orderService = new OrderService();
const scheduleService = new ScheduleService();

export class MachineService {
  /* eslint-disable class-methods-use-this */
  /**
   * This method gets a specific type of machine (or all) and returns a promise with the results
   * @param type is the type of machine to get
   * @param query is a specific mongdb query expression
   * @param limit is the number of items to get
   * @param skip is the number of items to skip
   * @returns a promise with the results
   */
  public getMachineType (type: String, query?: any, limit?: Number, skip?: Number) {
    const promises = [];
    let obj;
    switch (type) {
      case '3d-printer':
        obj = [];
        if (limit >= 0 && skip >= 0) {
          query ? promises.push(Printer3D.find(query).limit(limit).skip(skip))
            : promises.push(Printer3D.find().limit(limit).skip(skip));
        } else {
          query ? promises.push(Printer3D.find(query)) : promises.push(Printer3D.find());
        }
        break;
      case 'lasercutter':
        obj = [];
        if (limit >= 0 && skip >= 0) {
          query ? promises.push(Lasercutter.find(query).limit(limit).skip(skip))
            : promises.push(Lasercutter.find().limit(limit).skip(skip));
        } else {
          query ? promises.push(Lasercutter.find(query).limit(limit).skip(skip)) : promises.push(Lasercutter.find());
        }
        break;
      case 'otherMachine':
        obj = [];
        if (limit >= 0 && skip >= 0) {
          query ? promises.push(Other.find(query).limit(limit).skip(skip))
            : promises.push(Other.find().limit(limit).skip(skip));
        } else {
          query ? promises.push(Other.find(query)) : promises.push(Other.find());
        }
        break;
      case 'millingMachine':
        obj = [];
        if (limit >= 0 && skip >= 0) {
          query ? promises.push(MillingMachine.find(query).limit(limit).skip(skip))
            : promises.push(MillingMachine.find().limit(limit).skip(skip));
        } else {
          query ? promises.push(MillingMachine.find(query)) : promises.push(MillingMachine.find());
        }
        break;
      default:
        obj = {
          printers3d: [],
          lasercutters: [],
          millingMachines: [],
          otherMachines: []
        };
        promises.push(Printer3D.find());
        promises.push(Lasercutter.find());
        promises.push(Other.find());
        promises.push(MillingMachine.find());
        break;
    }
    return Promise.all(promises).then((results) => {
      if (results) {
        results.forEach((machines) => {
          machines.forEach((machine) => {
            if (Array.isArray(obj)) {
              obj.push(machine);
            } else {
              Object.keys(obj).forEach((type) => {
                if (type.startsWith(machine.type)) {
                  obj[type].push(machine);
                }
              });
            }
          });
        });
        return obj;
      }
      return [];
    });
  }

  /**
   * This method creates a specific type of machine and returns a promise with the results
   * type is the type of machine to create
   * params are the params of the machine
   * @returns a promise with the results
   */
  public create (type, params) {
    let error: IError;
    if (!params.type) {
      params.type = type;
    }
    switch (type) {
      case '3d-printer':
        return (new Printer3D(params)).save();
      case 'lasercutter':
        return (new Lasercutter(params)).save();
      case 'otherMachine':
        return (new Other(params)).save();
      case 'millingMachine':
        return (new MillingMachine(params)).save();
      default:
        error = {
          name: 'MACHINE_TYPE_NOT_SUPPORTED',
          message: 'Machine Type not supported!',
          type: ErrorType.MACHINE_TYPE_NOT_SUPPORTED
        };
        return Promise.reject(error);
    }
  }

  /**
   * This method toggles the activation status of a specific type of machine by a given id and returns
   * a promise with the success or failure type is the type of machine to delete
   * _id is the id of the machine
   * @returns a promise with the results
   */
  public async deleteById (type, _id) {
    let error: IError;
    try {
      switch (type) {
        case '3d-printer': {
          const printer3d = await Printer3D.findOne({ _id });
          return Printer3D.updateOne({ _id }, { activated: !printer3d.activated });
        }
        case 'lasercutter': {
          const lasercutter = await Lasercutter.findOne({ _id });
          return Lasercutter.updateOne({ _id }, { activated: !lasercutter.activated });
        }
        case 'otherMachine': {
          const otherMachine = await Other.findOne({ _id });
          return Other.updateOne({ _id }, { activated: !otherMachine.activated });
        }
        case 'millingMachine': {
          const millingMachine = await MillingMachine.findOne({ _id });
          return MillingMachine.updateOne({ _id }, { activated: !millingMachine.activated });
        }
        default:
          error = {
            name: 'MACHINE_TYPE_NOT_SUPPORTED',
            message: 'Machine Type not supported!',
            type: ErrorType.MACHINE_TYPE_NOT_SUPPORTED
          };
          return Promise.reject(error);
      }
    } catch (err) {
      error = {
        name: 'MACHINE_NOT_FOUND',
        stack: err.stack,
        message: 'Machine not found!',
        type: ErrorType.MACHINE_NOT_FOUND
      };
      return Promise.reject(error);
    }
  }

  /**
   * This method gets a specific type of machine by a given id and returns a promise with the result
   * type is the type of machine to get
   * _id is the id of the machine
   * @returns a promise with the results
   */
  public get (type, _id) {
    let error: IError;
    switch (type) {
      case '3d-printer':
        return Printer3D.findOne({ _id });
      case 'lasercutter':
        return Lasercutter.findOne({ _id });
      case 'otherMachine':
        return Other.findOne({ _id });
      case 'millingMachine':
        return MillingMachine.findOne({ _id });
      default:
        error = {
          name: 'MACHINE_TYPE_NOT_SUPPORTED',
          message: 'Machine Type not supported!',
          type: ErrorType.MACHINE_TYPE_NOT_SUPPORTED
        };
        return Promise.reject(error);
    }
  }

  /**
   * This method updates a specific type of machine by a given id and returns a promise with the result
   * type is the type of machine to update
   * _id is the id of the machine
   * machine is the machine with updated fields
   * @returns a promise with the result
   */
  public update (type, _id, machine) {
    let error: IError;
    delete machine.__v;
    switch (type) {
      case '3d-printer':
        return Printer3D.updateOne(
          { _id },
          machine,
          { upsert: true }
        ).then(() => Printer3D.findOne({ _id }));
      case 'lasercutter':
        return Lasercutter.updateOne(
          { _id },
          machine,
          { upsert: true }
        ).then(() => Lasercutter.findOne({ _id }));
      case 'otherMachine':
        return Other.updateOne(
          { _id },
          machine,
          { upsert: true }
        ).then(() => Other.findOne({ _id }));
      case 'millingMachine':
        return MillingMachine.updateOne(
          { _id },
          machine,
          { upsert: true }
        ).then(() => MillingMachine.findOne({ _id }));
      default:
        error = {
          name: 'MACHINE_TYPE_NOT_SUPPORTED',
          message: 'Machine Type not supported!',
          type: ErrorType.MACHINE_TYPE_NOT_SUPPORTED
        };
        return Promise.reject(error);
    }
  }

  /**
   * This method counts a specific type of machine returns a promise with the result
   * @param query is a mongodb query expression
   * @param type is the type of machine to count
   * @returns a promise with the result
   */
  public count (type: string, query: any) {
    let error: IError;
    switch (type) {
      case '3d-printer':
        return query ? Printer3D.countDocuments(query) : Printer3D.countDocuments();
      case 'lasercutter':
        return query ? Lasercutter.countDocuments(query) : Lasercutter.countDocuments();
      case 'otherMachine':
        return query ? Other.countDocuments(query) : Other.countDocuments();
      case 'millingMachine':
        return query ? MillingMachine.countDocuments(query) : MillingMachine.countDocuments();
      default:
        error = {
          name: 'MACHINE_TYPE_NOT_SUPPORTED',
          message: 'Machine Type not supported!',
          type: ErrorType.MACHINE_TYPE_NOT_SUPPORTED
        };
        return Promise.reject(error);
    }
  }

  /**
   * This method gets all machines without concerning about machine types
   * @returns a promise with the results
   */
  public getAllMachines () {
    return this.getMachineType('all');
  }

  /**
   * This method gets all machine types
   * @returns a promise with the results
   */
  public getMachineTypes () {
    return new Promise((resolve, reject) => {
      fs.readdir('api/models/machines', ((err, files) => {
        if (err) {
          reject(err);
        } else {
          const types = [];
          files.forEach((file) => {
            if (!file.startsWith('machine.basic')) {
              const split = file.split('.');
              let type = '';
              for (let i = 0; i < split.length; i += 1) {
                if (split[i] !== 'ts' && split[i] !== 'model') {
                  split[i] = split[i].charAt(0).toUpperCase() + split[i].substring(1);
                  type += `${split[i]} `;
                }
              }
              types.push(type.trim());
            }
          });
          resolve(types);
        }
      }));
    });
  }

  async countSuccessfulOrders (id: string) {
    const orders: Array<Object> = await orderService.getAll(
      { 'machine._id': id, $or: [{ status: 'representive' }, { status: 'completed' }] }
    );
    return orders;
  }

  /**
   * This method gets materials for a specific and given machine type
   * @param type is the machine type
   * @returns a promise with the results
   */
  public getMaterialsByType (type) {
    type += 'Material';
    return materialService.getMaterialByType(type);
  }

  /**
   * Gets the schedules of a given id for a machine
   * @param id is the id of the machine
   * @param reqQuery is the request query. Might contain a start and end date to filter schedules
   * @returns an array of schedule objects
   */
  public async getSchedules (id: string, reqQuery: { startDay: string, endDay: string }) {
    if (reqQuery.startDay && reqQuery.endDay) {
      const startDate = new Date((new Date(reqQuery.startDay)).setHours(0, 0, 0));
      const endDate = new Date((new Date(reqQuery.endDay)).setHours(23, 59, 59));
      const query = {
        $and: [
          {
            startDate: {
              $gte: startDate
            }
          },
          {
            endDate: {
              $lte: endDate
            }
          }
        ]
      };
      return scheduleService.getAll({ 'machine.id': id, ...query });
    }
    return scheduleService.getAll({ 'machine.id': id });
  }
  /* eslint-enable class-methods-use-this */
}

export default MachineService;
