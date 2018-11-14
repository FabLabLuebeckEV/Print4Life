import * as mongoose from 'mongoose';
import Fablab from '../models/fablab.model';


export class FablabService {
  /* eslint-disable class-methods-use-this */
  public getById (id) {
    const _id = mongoose.Types.ObjectId(id);
    return Fablab.findOne({ _id });
  }

  public getAll () {
    return Fablab.find();
  }

  public create (params) {
    const fablab = new Fablab(params);
    return fablab.save();
  }

  public update (_id, params) {
    return Fablab.update(
      { _id },
      params,
      { upsert: true }
    ).then(() => Fablab.findOne({ _id }));
  }

  public async deleteById (id) {
    const fablab = await this.getById(id);
    fablab.activated = false;
    return this.update(id, fablab);
  }
  /* eslint-enable class-methods-use-this */
}

export default FablabService;
