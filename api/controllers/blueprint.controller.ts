import BlueprintService from '../services/blueprint.service';
import logger from '../logger';
import validatorService from '../services/validator.service';

const blueprintService = new BlueprintService();

function getAll (req, res) {
  blueprintService.getAll().then((blueprints) => {
    logger.info(`GET Blueprints with result ${JSON.stringify(blueprints)}`);
    res.json({ blueprints });
  }).catch((err) => {
    logger.error(err);
    res.status(500).send(err);
  });
}

async function get (req, res) {
  const checkId = validatorService.checkId(req.params && req.params.id ? req.params.id : undefined);
  if (checkId) {
    logger.error(checkId.error);
    return res.status(checkId.status).send(checkId.error);
  }

  try {
    const blueprint = await blueprintService.get(req.params.id);
    if (!blueprint) {
      logger.error({ error: `Blueprint by id '${req.params.id}' not found` });
      return res.status(404).send({ error: `Blueprint by id '${req.params.id}' not found` });
    }
    logger.info(`GET BlueprintById with result ${JSON.stringify(blueprint)}`);
    return res.json({ blueprint });
  } catch (err) {
    logger.error(err);
    return res.status(500).send(err);
  }
}

export default {
  getAll,
  get
};
