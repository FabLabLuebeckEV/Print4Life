import logger from '../logger';
import Printer from '../models/printer.model';

function getPrinters () {
  return Printer.find((err, printers) => {
    if (err) return logger.error(err);
    else if (printers) {
      return printers;
    }
    return [];
  });
}
export default { getPrinters };
