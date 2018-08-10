import * as express from 'express';
import orderCtrl from '../controllers/order.controller';
import logger from '../logger';

const router = express.Router();

router.route('/').get((req, res) => {
  orderCtrl.getOrders(undefined, req.query.limit, req.query.skip).then((orders) => {
    if (orders.length === 0) {
      res.status(204).send({ orders });
    } else {
      res.status(200).send({ orders });
    }
  }).catch((err) => {
    logger.error({ error: 'Error while trying to get all orders!', stack: err });
    res.status(500).send({ error: 'Error while trying to get all orders!', stack: err });
  });
});

router.route('/search').post((req, res) => {
  orderCtrl.getOrders(req.body.query, req.body.limit, req.body.skip).then((orders) => {
    if (orders.length === 0) {
      res.status(204).send({ orders });
    } else {
      res.status(200).send({ orders });
    }
  }).catch((err) => {
    logger.error({
      error: `Error while trying to search for a specific order with query: ${req.body.query}`,
      stack: err
    });
    res.status(500).send({
      error: `Error while trying to search for a specific order with query: ${req.body.query}`,
      stack: err
    });
  });
});

router.route('/count').post((req, res) => {
  orderCtrl.count(req.body.query).then((count) => {
    res.status(200).send({ count });
  }).catch((err) => {
    logger.error({ error: 'Error while counting orders!', err });
    res.status(500).send({ error: 'Error while counting orders!', err });
  });
});

router.route('/').post((req, res) => {
  orderCtrl.createOrder(req.body).then((order) => {
    res.status(201).send({ order });
  }).catch((err) => {
    logger.error({ error: 'Malformed order, one or more parameters wrong or missing', stack: err });
    res.status(400).send({ error: 'Malformed order, one or more parameters wrong or missing', stack: err });
  });
});

router.route('/:id').put((req, res) => {
  orderCtrl.updateOrder(req.body).then((order) => {
    res.status(200).send({ order });
  }).catch((err) => {
    logger.error({ error: 'Malformed update.', stack: err });
    res.status(400).send({ error: 'Malformed update.', stack: err });
  });
});

router.route('/:id').delete((req, res) => {
  orderCtrl.deleteOrder(req.params.id).then((order) => {
    res.status(200).send({ order });
  }).catch((err) => {
    logger.error({ error: 'Malformed Request!', stack: err });
    res.status(400).send({ error: 'Malformed Request!', stack: err });
  });
});

router.route('/status/').get((req, res) => {
  orderCtrl.getStatus().then((status) => {
    if (!status) {
      res.status(204).send();
    } else {
      res.status(200).send({ status });
    }
  }).catch((err) => {
    logger.error({ error: 'Error while trying to get all valid status!', stack: err });
    res.status(500).send({ error: 'Error while trying to get all valid status!', stack: err });
  });
});

router.route('/:id/comment').post((req, res) => {
  orderCtrl.createComment(req.params.id, { timestamp: new Date(), ...req.body }).then((comment) => {
    if (!comment) {
      logger.error({ error: `Could not find any Order with id ${req.params.id}` });
      res.status(404).send({ error: `Could not find any Order with id ${req.params.id}` });
    } else {
      res.status(201).send({ comment });
    }
  }).catch((err) => {
    logger.error({ error: 'Malformed Request! Could not add comment to order.', stack: err });
    res.status(400).send({ error: 'Malformed Request! Could not add comment to order.', stack: err });
  });
});

router.route('/:id').get((req, res) => {
  orderCtrl.getOrderById(req.params.id).then((order) => {
    if (!order) {
      logger.error({ error: `Could not find any Order with id ${req.params.id}` });
      res.status(404).send({ error: `Could not find any Order with id ${req.params.id}` });
    } else {
      res.status(200).send({ order });
    }
  }).catch((err) => {
    logger.error({ error: `Error while trying to get Order with id ${req.params.id}`, stack: err });
    res.status(500).send({ error: `Error while trying to get Order with id ${req.params.id}`, stack: err });
  });
});

export default router;
