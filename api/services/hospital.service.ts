import * as mongoose from 'mongoose';
import { isNumber } from 'util';
import Hospital from '../models/hospital.model';
/* eslint-disable no-unused-vars */
import ModelService from './model.service';
/* eslint-enable no-unused-vars */

export class HopsitalService implements ModelService {
  /* eslint-disable class-methods-use-this */
  /**
   * This method gets a hospital by its id
   * @param id is the id of the hospital
   * @returns a promise with the results
   */
  public get (id) {
    const _id = mongoose.Types.ObjectId(id);
    return Hospital.findOne({ _id });
  }

  /**
   * This method gets all hospitals
   * @returns a promise with the results
   */
  public getAll (query?: any, limit?: any, skip?: any) {
    let l: Number;
    let s: Number;
    let promise;
    if ((limit && skip) || (isNumber(limit) && isNumber(skip))) {
      l = Number.parseInt(limit, 10);
      s = Number.parseInt(skip, 10);
      query ? promise = Hospital.find(query).limit(l).skip(s) : promise = Hospital.find(query).limit(l).skip(s);
    } else {
      query ? promise = Hospital.find(query) : promise = Hospital.find();
    }
    return promise;
  }

  /**
   * This method creates a hospital by given parameters
   * @param params are the params of the hospital
   * @returns a promise with the results
   */
  public create (params) {
    const fablab = new Hospital(params);
    return fablab.save();
  }

  /**
   * This method updates a hospital
   * @param _id is the id of the hospital
   * @param params are new updated params of the hospital
   * @returns a promise with the results
   */
  public update (_id, params) {
    return Hospital.updateOne({ _id }, params, { upsert: true })
      .then(() => Hospital.findOne({ _id }));
  }

  /**
   * This method deletes a hospital by its id
   * @param id is the id of the hospital
   * @returns a promise with the result
   */
  public async deleteById (id) {
    const hospital = await this.get(id);
    hospital.activated = false;
    return this.update(id, hospital);
  }

  /**
   * This method counts all hospital
   * @returns a promise with the results
   */
  public count () {
    return Hospital.countDocuments();
  }
  /* eslint-enable class-methods-use-this */
}

export default HopsitalService;
