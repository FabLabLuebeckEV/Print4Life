import Order from '../models/order.model';
import MachineService from './machine.service';
import FablabService from './fablab.service';
import logger from '../logger';

export class StatisticService {
  public machineService = new MachineService();

  public fablabService = new FablabService();

  /* eslint-disable class-methods-use-this */
  public async getOrdersByDate (startDate: Date, endDate: Date) {
    try {
      const query = {
        $and: []
      };
      if (startDate) {
        query.$and.push({ createdAt: { $gte: startDate } });
      }
      if (endDate) {
        query.$and.push({ createdAt: { $lte: endDate } });
      }
      const orders = await Order.find(query);
      /* eslint-disable no-restricted-syntax */
      const statistics = orders && orders.length ? {
        fablabs: [],
        machines: {}
      } : undefined;
      for (const order of orders) {
        /* eslint-enable no-restricted-syntax */
        if (order.machine && order.machine.type && order.machine._id) {
          /* eslint-disable no-await-in-loop */
          if (order.machine.type !== 'unknown') {
            order.machineObj = await this.machineService.get(order.machine.type, order.machine._id);
          }
        }
        order.fablabObj = await this.fablabService.get(order.fablabId);
        this.addToFablabEntry(statistics, order);
        this.addToMachineEntry(statistics, order);
        /* eslint-enable no-await-in-loop */
      }
      return statistics;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  public async addToFablabEntry (statistics: any, order: any) {
    let exists = statistics.fablabs.findIndex((fablab) => fablab.name === order.fablabObj.name);
    if (exists === -1) {
      statistics.fablabs.push({ name: order.fablabObj.name, orders: {} });
      exists = statistics.fablabs.length - 1;
    }
    if (!statistics.fablabs[exists].orders) {
      statistics.fablabs[exists].orders = {};
    }
    if (!statistics.fablabs[exists].orders[order.status]
      || !Array.isArray(statistics.fablabs[exists].orders[order.status])) {
      statistics.fablabs[exists].orders[order.status] = [];
    }
    const orderCopy = JSON.parse(JSON.stringify(order));
    delete orderCopy.machineObj;
    delete orderCopy.fablabObj;
    delete orderCopy.__v;
    statistics.fablabs[exists].orders[order.status].push(orderCopy);
  }

  public async addToMachineEntry (statistics: any, order: any) {
    const mType = order.machine.type;
    const exists = statistics.machines[mType];
    let mIndex = exists && mType !== 'unknown'
      ? statistics.machines[mType].findIndex((machine) => machine.deviceName === order.machineObj.deviceName
        && machine.id === order.machineObj.id && machine.fablabId === order.machineObj.fablabId) : -1;
    if (mType !== 'unknown') {
      if (!exists) {
        statistics.machines[mType] = [];
        statistics.machines[mType].push(
          {
            deviceName: order.machineObj.deviceName,
            id: order.machineObj.id,
            fablabId: order.machineObj.fablabId,
            orders: {}
          }
        );
        mIndex = statistics.machines[mType].length - 1;
      }
      if (!statistics.machines[mType][mIndex].orders) {
        statistics.machines[mType][mIndex].orders = {};
      }
      if (!statistics.machines[mType][mIndex].orders[order.status]
        || !Array.isArray(statistics.machines[mType][mIndex].orders[order.status])) {
        statistics.machines[mType][mIndex].orders[order.status] = [];
      }
      const orderCopy = JSON.parse(JSON.stringify(order));
      delete orderCopy.machineObj;
      delete orderCopy.fablabObj;
      delete orderCopy.__v;
      statistics.machines[mType][mIndex].orders[order.status].push(orderCopy);
    }
  }
  /* eslint-enable class-methods-use-this */
}


export default StatisticService;
