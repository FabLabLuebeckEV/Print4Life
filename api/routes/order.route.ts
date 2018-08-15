import * as express from 'express';
import orderCtrl from '../controllers/order.controller';
import logger from '../logger';
import validatorService from '../services/validator.service';

const router = express.Router();

router.route('/').get((req, res) => {
  orderCtrl.getOrders(undefined, req.query.limit, req.query.skip).then((orders) => {
    if (orders.length === 0) {
      logger.info('GET Orders without result');
      res.status(204).send({ orders });
    } else if (req.query.limit && req.query.skip) {
      logger.info(`GET Orders with partial result ${orders}`);
      res.status(206).send({ orders });
    } else {
      logger.info(`GET Orders with results ${orders}`);
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
      logger.info(`POST search for orders with query ${req.body.query}, ` +
        `limit ${req.body.limit} skip ${req.body.skip} holds no results`);
      res.status(204).send({ orders });
    } else if (req.body.limit && req.body.skip) {
      logger.info(`POST search for orders with query ${req.body.query}, ` +
        `limit ${req.body.limit} skip ${req.body.skip} ` +
        `holds partial results ${orders}`);
      res.status(206).send({ orders });
    } else {
      logger.info(`POST search for orders with query ${req.body.query}, ` +
        `limit ${req.body.limit} skip ${req.body.skip} ` +
        `holds results ${orders}`);
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
    logger.info(`POST count with result ${count}`);
    res.status(200).send({ count });
  }).catch((err) => {
    logger.error({ error: 'Error while counting orders!', err });
    res.status(500).send({ error: 'Error while counting orders!', err });
  });
});

router.route('/').post((req, res) => {
  orderCtrl.createOrder(req.body).then((order) => {
    logger.info(`POST Order with result ${order}`);
    res.status(201).send({ order });
  }).catch((err) => {
    logger.error({ error: 'Malformed order, one or more parameters wrong or missing', stack: err });
    res.status(400).send({ error: 'Malformed order, one or more parameters wrong or missing', stack: err });
  });
});

router.route('/:id').put((req, res) => {
  const checkId = validatorService.checkId(req.params.id);
  if (checkId) {
    res.status(checkId.status).send({ error: checkId.error });
  } else {
    orderCtrl.updateOrder(req.body).then((order) => {
      logger.info(`PUT Order with result ${order}`);
      res.status(200).send({ order });
    }).catch((err) => {
      logger.error({ error: 'Malformed update.', stack: err });
      res.status(400).send({ error: 'Malformed update.', stack: err });
    });
  }
});

router.route('/:id').delete((req, res) => {
  const checkId = validatorService.checkId(req.params.id);
  if (checkId) {
    res.status(checkId.status).send({ error: checkId.error });
  } else {
    orderCtrl.deleteOrder(req.params.id).then((order) => {
      logger.info(`DELETE Order with result ${order}`);
      res.status(200).send({ order });
    }).catch((err) => {
      logger.error({ error: 'Malformed Request!', stack: err });
      res.status(400).send({ error: 'Malformed Request!', stack: err });
    });
  }
});

router.route('/status/').get((req, res) => {
  orderCtrl.getStatus().then((status) => {
    if (!status) {
      logger.info('GET status without result');
      res.status(204).send();
    } else {
      logger.info(`GET status with result ${status}`);
      res.status(200).send({ status });
    }
  }).catch((err) => {
    logger.error({ error: 'Error while trying to get all valid status!', stack: err });
    res.status(500).send({ error: 'Error while trying to get all valid status!', stack: err });
  });
});

router.route('/:id/comment').post((req, res) => {
  const checkId = validatorService.checkId(req.params.id);
  if (checkId) {
    res.status(checkId.status).send({ error: checkId.error });
  } else {
    orderCtrl.createComment(req.params.id, { timestamp: new Date(), ...req.body }).then((comment) => {
      if (!comment) {
        logger.error({ error: `Could not find any Order with id ${req.params.id}` });
        res.status(404).send({ error: `Could not find any Order with id ${req.params.id}` });
      } else {
        logger.info(`POST comment with result ${comment}`);
        res.status(201).send({ comment });
      }
    }).catch((err) => {
      logger.error({ error: 'Malformed Request! Could not add comment to order.', stack: err });
      res.status(400).send({ error: 'Malformed Request! Could not add comment to order.', stack: err });
    });
  }
});

router.route('/:id').get((req, res) => {
  const checkId = validatorService.checkId(req.params.id);
  if (checkId) {
    res.status(checkId.status).send({ error: checkId.error });
  } else {
    orderCtrl.getOrderById(req.params.id).then((order) => {
      if (!order) {
        logger.error({ error: `Could not find any Order with id ${req.params.id}` });
        res.status(404).send({ error: `Could not find any Order with id ${req.params.id}` });
      } else {
        logger.info(`GET Order with result ${order}`);
        res.status(200).send({ order });
      }
    }).catch((err) => {
      logger.error({ error: `Error while trying to get Order with id ${req.params.id}`, stack: err });
      res.status(500).send({ error: `Error while trying to get Order with id ${req.params.id}`, stack: err });
    });
  }
});

export default router;
