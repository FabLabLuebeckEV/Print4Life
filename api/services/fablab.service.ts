import * as mongoose from 'mongoose';
import Fablab from '../models/fablab.model';


export class FablabService {
  /* eslint-disable class-methods-use-this */
  /**
   * This method gets a fablab by its id
   * @param id is the id of the fablab
   * @returns a promise with the results
   */
  public getById (id) {
    const _id = mongoose.Types.ObjectId(id);
    return Fablab.findOne({ _id });
  }

  /**
   * This method gets all fablabs
   * @returns a promise with the results
   */
  public getAll () {
    return Fablab.find();
  }

  /**
   * This method creates a fablab by given parameters
   * @param params are the params of the fablab
   * @returns a promise with the results
   */
  public create (params) {
    const fablab = new Fablab(params);
    return fablab.save();
  }

  /**
   * This method updates a fablab
   * @param _id is the id of the fablab
   * @param params are new updated params of the fablab
   * @returns a promise with the results
   */
  public update (_id, params) {
    return Fablab.update(
      { _id },
      params,
      { upsert: true }
    ).then(() => Fablab.findOne({ _id }));
  }

  /**
   * This method deletes a fablab by its id
   * @param id is the id of the fablab
   * @returns a promise with the result
   */
  public async deleteById (id) {
    const fablab = await this.getById(id);
    fablab.activated = false;
    return this.update(id, fablab);
  }
  /* eslint-enable class-methods-use-this */
}

export default FablabService;
