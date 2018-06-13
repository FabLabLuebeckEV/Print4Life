import * as express from 'express';
import helloWorldRoute from './helloWorld.route';

const router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/api/v1/helloworld');
});

router.use('/api/v1/helloworld', helloWorldRoute);

export default router;
