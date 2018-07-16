import * as express from 'express';
import machineRoute from './machine.route';

const router = express.Router();

router.get('/', (req, res) => {
  res.send({ health: 'alive' });
});

router.use('/machine/', machineRoute);

export default router;
