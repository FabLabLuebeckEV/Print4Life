import * as express from 'express';
import helloWorldRoute from './helloWorld.route';

const router = express.Router();

router.get('/', (req, res) => {
  res.redirect('helloworld');
});

router.use('/helloworld', helloWorldRoute);

export default router;
