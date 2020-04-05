import { Blueprint } from '../models/blueprint.model';
/* eslint-disable no-unused-vars */
import ModelService from './model.service';
/* eslint-enable no-unused-vars */

export class BlueprintService implements ModelService {
  /* eslint-disable class-methods-use-this */
  /**
     * This method creates a new user
     * @param user are the params for the 3d printer
     * @returns a promise with the results
     */
  public async create (blueprint) {
    const newBlueprint = new Blueprint(
      ...blueprint
    );

    return newBlueprint.save();
  }


  public async getAll (limit?: string, skip?: string) {
    return Blueprint.find().limit(limit).skip(skip);
  }

  public async get (id: string) {
    return Blueprint.findById(id);
  }

  public async deleteById (id) {
    const bp = await this.get(id);
    bp.activated = false;
    return this.update(bp);
  }


  public async update (bp) {
    delete bp.__v;
    return Blueprint.updateOne(
      { _id: bp._id },
      bp,
      { upsert: true }
    ).then(() => Blueprint.findOne({ _id: bp._id }));
  }

  /**
     * Counts users by a given query
     * @param query is the query to consider
     * @returns a promise with the results
     */
  public count (query) {
    return Blueprint.countDocuments(query);
  }
  /* eslint-enable class-methods-use-this */
}

export default BlueprintService;
