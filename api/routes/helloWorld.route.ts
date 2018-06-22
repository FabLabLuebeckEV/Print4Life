import * as express from 'express';
import helloWorldCtrl from '../controllers/helloWorld.controller';


const router = express.Router();

router.route('/').get((req, res) => {
  res.json({ message: helloWorldCtrl.helloWorld() });
});

export default router;
