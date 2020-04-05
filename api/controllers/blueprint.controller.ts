import BlueprintService from '../services/blueprint.service';
import logger from '../logger';

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

export default {
  getAll
};
