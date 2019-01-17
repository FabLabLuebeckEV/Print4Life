import { isNumber } from 'util';
/* eslint-disable no-unused-vars */
import ModelService from './model.service';
/* eslint-enable no-unused-vars */
import IoTDevice from '../models/iot-device.model';

export class IoTDeviceService implements ModelService {
  /* eslint-disable class-methods-use-this */
  /**
       * This method gets all iot devices. The result can be limited as well as some items skipped
       * @param limit is the limit of items to get
       * @param skip is the amount of items to skip (counted from the beginning)
       * @returns a promise with the results
       */
  getAll (query: any, limit?: string, skip?: string) {
    let l: Number;
    let s: Number;
    let promise;
    if ((limit && skip) || (isNumber(limit) && isNumber(skip))) {
      l = Number.parseInt(limit, 10);
      s = Number.parseInt(skip, 10);
      query ? promise = IoTDevice.find(query).limit(l).skip(s) : promise = IoTDevice.find(query).limit(l).skip(s);
    } else {
      query ? promise = IoTDevice.find(query) : promise = IoTDevice.find();
    }
    return promise;
  }

  /**
       * This method creates a new iot device
       * @param params are the params for the iot device
       * @returns a promise with the results
       */
  create (iotDevice: any) {
    delete iotDevice._id;
    const newIoTDevice = new IoTDevice({
      ...iotDevice
    });
    return newIoTDevice.save();
  }

  /**
       * This method gets an iot device by its id
       * @param id is the id of the iot device
       * @returns a promise with the results
       */
  get (id: string) {
    return IoTDevice.findOne({ _id: id });
  }

  /**
       * This method deletes an iot device by its id
       * @returns a promise with the result
       */
  async deleteById (id: string) {
    const schedule = await this.get(id);
    return schedule.remove();
  }

  /**
       * This method updates an iot device
       * @param id is the id of the iot device
       * @param machine is the machine obj that updates the iot device
       * @returns a promise with the results
       */
  update (id: string, iotDevice: { _id: string, __v: string }) {
    delete iotDevice.__v;
    return IoTDevice.updateOne(
      { _id: id },
      iotDevice,
      { upsert: true }
    ).then(() => IoTDevice.findOne({ _id: id }));
  }

  /**
      * This method counts all iot devices
      * @returns a promise with the result
      */
  count (query?: object) {
    return IoTDevice.countDocuments(query);
  }
  /* eslint-enable class-methods-use-this */
}

export default IoTDeviceService;
