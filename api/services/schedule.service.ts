import { isNumber } from 'util';
/* eslint-disable no-unused-vars */
import ModelService from './model.service';
/* eslint-enable no-unused-vars */
import Schedule from '../models/schedule.model';

export class ScheduleService implements ModelService {
  /* eslint-disable class-methods-use-this */
  /**
     * This method gets all schedules. The result can be limited as well as some items skipped
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
      query ? promise = Schedule.find(query).limit(l).skip(s) : promise = Schedule.find(query).limit(l).skip(s);
    } else {
      query ? promise = Schedule.find(query) : promise = Schedule.find();
    }
    return promise;
  }

  /**
     * This method creates a new schedule
     * @param params are the params for the schedule
     * @returns a promise with the results
     */
  create (schedule: object) {
    const newSchedule = new Schedule({
      ...schedule
    });
    return newSchedule.save();
  }

  /**
     * This method gets a schedule by its id
     * @param id is the id of the schedule
     * @returns a promise with the results
     */
  get (id: string) {
    return Schedule.findOne({ _id: id });
  }

  /**
     * This method deletes a schedule by its id
     * @returns a promise with the result
     */
  async deleteById (id: string) {
    const schedule = await this.get(id);
    return schedule.remove();
  }

  /**
     * This method updates a schedule
     * @param id is the id of the schedule
     * @param machine is the machine obj that updates the schedule
     * @returns a promise with the results
     */
  update (id: string, schedule: { _id: string, __v: string }) {
    delete schedule.__v;
    return Schedule.updateOne(
      { _id: id },
      schedule,
      { upsert: true }
    ).then(() => Schedule.findOne({ _id: id }));
  }

  /**
    * This method counts all schedules
     * @returns a promise with the result
     */
  count (query?: object) {
    return Schedule.countDocuments(query);
  }

  /**
   * This method checks if a given schedule is between another schedule of the machine and therefore isn't valid
   * @param schedule is the schedule to check
   * @returns true if the schedule is valid, otherwise throws an error
   */
  async checkDateTime (
    schedule: { id: String, startDate: Date, endDate: Date, machine: { type: String, id: String } }
  ):
    Promise<boolean> {
    const schedulesOfMachine = await Schedule.find({ 'machine.id': schedule.machine.id });
    schedule.startDate = new Date(schedule.startDate);
    schedule.endDate = new Date(schedule.endDate);
    schedulesOfMachine.forEach((s) => {
      // date is between one schedule
      if (schedule.id !== s.id && ((schedule.startDate >= s.startDate && schedule.startDate <= s.endDate)
        || (schedule.endDate >= s.startDate && schedule.endDate <= s.endDate))) {
        throw new Error(`Schedules Dates are between another schedule for the machine ${schedule.machine.id}`);
      }
    });
    return true;
  }
  /* eslint-enable class-methods-use-this */
}

export default ScheduleService;
