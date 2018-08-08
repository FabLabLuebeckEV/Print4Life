import * as express from 'express';
import orderCtrl from '../controllers/order.controller';

const router = express.Router();

router.route('/').get((req, res) => {
  orderCtrl.getOrders().then((orders) => {
    if (orders.length === 0) {
      res.status(204).send({ orders });
    } else {
      res.status(200).send({ orders });
    }
  }).catch((err) => {
    res.status(500).send({ error: 'There aren\'t any orders yet.', stack: err });
  });
});

router.route('/').post((req, res) => {
  orderCtrl.createOrder(req.body).then((order) => {
    res.status(201).send({ order });
  }).catch((err) => {
    res.status(400).send({ error: 'Malformed order, one or more parameters wrong or missing', stack: err });
  });
});

router.route('/:id').put((req, res) => {
  orderCtrl.updateOrder(req.body).then((order) => {
    res.status(200).send({ order });
  }).catch((err) => {
    res.status(400).send({ error: 'Order not found or malformed update.', stack: err });
  });
});

router.route('/:id').delete((req, res) => {
  orderCtrl.deleteOrder(req.params.id).then((order) => {
    res.status(200).send({ order });
  }).catch((err) => {
    res.status(400).send({ error: 'Order not found.', stack: err });
  });
});

router.route('/status/').get((req, res) => {
  orderCtrl.getStatus().then((status) => {
    res.status(200).send({ status });
  }).catch((err) => {
    res.status(500).send({ error: 'Couldn\'t find any valid status.', stack: err });
  });
});

router.route('/:id').get((req, res) => {
  orderCtrl.getOrderById(req.params.id).then((order) => {
    res.status(200).send({ order });
  }).catch((err) => {
    res.status(400).send({ error: 'Could not find order.', stack: err });
  });
});

export default router;
