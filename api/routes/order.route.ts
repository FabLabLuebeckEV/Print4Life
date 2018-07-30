import * as express from 'express';
import orderCtrl from '../controllers/order.controller';

const router = express.Router();

router.route('/').get((req, res) => {
  orderCtrl.getOrders().then((orders) => {
    res.json({ orders });
  }).catch((err) => {
    res.status(500).send({ error: 'There aren\'t any orders yet.', stack: err });
  });
});

router.route('/placeOrder').post((req, res) => {
  orderCtrl.placeOrder(req.body).then((order) => {
    res.json({ order });
  }).catch((err) => {
    res.status(400).send({ error: 'Malformed order, one or more parameters wrong or missing', stack: err });
  });
});

router.route('/updateOrder').post((req, res) => {
  orderCtrl.updateOrder(req.body).then((order) => {
    res.json({ order });
  }).catch((err) => {
    res.status(400).send({ error: 'Order not found or malformed update.', stack: err });
  });
});

router.route('/deleteOrder/:id').get((req, res) => {
  orderCtrl.deleteOrder(req.params.id).then((order) => {
    res.json({ order });
  }).catch((err) => {
    res.status(400).send({ error: 'Order not found.', stack: err });
  });
});

router.route('/:id').get((req, res) => {
  orderCtrl.getOrderById(req.params.id).then((order) => {
    res.json({ order });
  }).catch((err) => {
    res.status(400).send({ error: 'Could not find order.', stack: err });
  });
});

export default router;
