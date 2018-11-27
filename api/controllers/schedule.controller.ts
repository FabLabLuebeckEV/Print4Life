import validatorService from '../services/validator.service';
import logger from '../logger';
import ScheduleService from '../services/schedule.service';
import MachineService from '../services/machine.service';

const scheduleService = new ScheduleService();
const machineService = new MachineService();

function get (req, res) {
  const checkId = validatorService.checkId(req.params.id);
  if (checkId) {
    res.status(checkId.status).send({ error: checkId.error });
  } else {
    scheduleService.get(req.params.id).then((schedule) => {
      if (!schedule) {
        logger.error({ error: `Could not find any Schedule with id ${req.params.id}` });
        res.status(404).send({ error: `Could not find any Schedule with id ${req.params.id}` });
      } else {
        logger.info(`GET Schedule with result ${JSON.stringify(schedule)}`);
        res.status(200).send({ schedule });
      }
    }).catch((err) => {
      const error = `Error while trying to get Schedule with id ${req.params.id}`;
      logger.error({ error, stack: err });
      res.status(500).send({ error });
    });
  }
}

function getAll (req, res) {
  req.query = validatorService.checkQuery(req.query);
  scheduleService.getAll(undefined, req.query.limit, req.query.skip).then((schedules) => {
    if (schedules.length === 0) {
      logger.info('GET Schedules without result');
      res.status(204).send();
    } else if (req.query.limit && req.query.skip) {
      logger.info(`GET Schedules with partial result ${JSON.stringify(schedules)}`);
      res.status(206).send({ schedules });
    } else {
      logger.info(`GET Schedules with results ${JSON.stringify(schedules)}`);
      res.status(200).send({ schedules });
    }
  }).catch((err) => {
    const error = 'Error while trying to get all schedules!';
    logger.error({ error, stack: err });
    res.status(500).send({ error });
  });
}

async function create (req, res) {
  try {
    if (req.body.startDate && req.body.endDate && req.body.machine) {
      await scheduleService.checkDateTime({ id: req.params.id, ...req.body });
    }
  } catch (err) {
    logger.error({ error: err.message, stack: err });
    return res.status(400).send({ error: err.message });
  }

  try {
    const schedule = await scheduleService.create(req.body);
    const machine = await machineService.get(schedule.machine.type, schedule.machine.id);
    if (!machine.schedules.includes(schedule.id)) {
      machine.schedules.push(schedule.id);
      machineService.update(schedule.machine.type, schedule.machine.id, machine);
    }
    logger.info(`POST Schedule with result ${JSON.stringify(schedule)}`);
    return res.status(201).send({ schedule });
  } catch (err) {
    const error = 'Malformed schedule, one or more parameters wrong or missing';
    logger.error({ error, stack: err });
    return res.status(400).send({ error });
  }
}

async function update (req, res) {
  const checkId = validatorService.checkId(req.params.id);
  if (checkId) {
    return res.status(checkId.status).send({ error: checkId.error });
  }
  try {
    if (req.body.startDate && req.body.endDate && req.body.machine) {
      await scheduleService.checkDateTime({ id: req.params.id, ...req.body });
    }
  } catch (err) {
    logger.error({ error: err.message, stack: err });
    return res.status(400).send({ error: err.message });
  }

  try {
    let schedule;
    // old machine is changed in schedule
    if (req.body.machine.type && req.body.machine.id) {
      schedule = await scheduleService.get(req.params.id);
      const oldMachine = await machineService.get(schedule.machine.type, schedule.machine.id);
      if (schedule.machine.type !== req.body.machine.type || schedule.machine.id !== req.body.machine.id) {
        oldMachine.schedules = oldMachine.schedules.filter((e) => e !== schedule.id);
        machineService.update(schedule.machine.type, schedule.machine.id, oldMachine);
      }
    }
    schedule = await scheduleService.update(req.params.id, req.body);
    const machine = await machineService.get(schedule.machine.type, schedule.machine.id);
    if (!machine.schedules.includes(schedule.id)) {
      machine.schedules.push(schedule.id);
      machineService.update(schedule.machine.type, schedule.machine.id, machine);
    }
    logger.info(`PUT Schedule with result ${JSON.stringify(schedule)}`);
    return res.status(200).send({ schedule });
  } catch (err) {
    const error = 'Malformed update.';
    logger.error({ error, stack: err });
    return res.status(400).send({ error });
  }
}

async function deleteById (req, res) {
  const checkId = validatorService.checkId(req.params.id);
  if (checkId) {
    res.status(checkId.status).send({ error: checkId.error });
  } else {
    try {
      const oldSchedule = await scheduleService.get(req.params.id);
      const schedule = await scheduleService.deleteById(req.params.id);
      const machine = await machineService.get(schedule.machine.type, schedule.machine.id);
      machine.schedules = machine.schedules.filter((e) => e !== oldSchedule.id);
      machineService.update(oldSchedule.machine.type, oldSchedule.machine.id, machine);
      logger.info(`DELETE Schedule with result ${JSON.stringify(schedule)}`);
      res.status(200).send({ schedule });
    } catch (err) {
      const error = 'Malformed Request!';
      logger.error({ error, stack: err });
      res.status(400).send({ error });
    }
  }
}

export default {
  get, getAll, create, update, deleteById
};
