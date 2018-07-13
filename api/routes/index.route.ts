import * as express from 'express';
import machineRoute from './machine.route';
import transformRoute from './transform.route';

const router = express.Router();

router.get('/', (req, res) => {
  res.send({ health: 'alive' });
});

router.use('/machine/', machineRoute);
router.use('/transform/', transformRoute);

export default router;
