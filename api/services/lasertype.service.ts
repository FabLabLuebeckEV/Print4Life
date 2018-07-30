import { LaserType } from '../models/lasertype.model';

function getLaserTypes () {
  return LaserType.find();
}

export default {
  getLaserTypes,
};
