import * as express from 'express';
import machineRoute from './machine.route';
import orderRoute from './order.route';
import usersRoute from './user.route';
import transformRoute from './transform.route';
import fablabRoute from './fablab.route';

const router = express.Router();

router.get('/', (req, res) => {
  res.send({ health: 'alive' });
});

router.use('/machines/', machineRoute);
router.use('/orders/', orderRoute);
router.use('/users/', usersRoute);
router.use('/transform/', transformRoute);
router.use('/fablabs/', fablabRoute);

export default router;
