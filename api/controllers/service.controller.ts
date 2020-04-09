
import emailService from '../services/email.service';

function calculateDistance (x: number, y: number): number {
  // Woanders hin machen
  const geolocations = {};
  geolocations['1'] = [8.327379, 53.30830];
  geolocations['2'] = [8.421820, 50.00490];
  /* const csv = require('csv-parser');
  const fs = require('fs');

  fs.createReadStream('dist/assets/PLZ.csv')
    .pipe(csv())
    .on('data', (row) => {
      geolocations[row.PLZ] = [parseFloat(row.Lon), parseFloat(row.Lat)];
    })
    .on('end', () => {

    }); */
  let distance;
  try {
    const lat1 = (geolocations[x.toString()])[1];
    const lon1 = (geolocations[x.toString()])[0];
    const lat2 = (geolocations[y.toString()])[1];
    const lon2 = (geolocations[y.toString()])[0];
    const dx = 71.5 * (lon1 - lon2);
    const dy = 111.3 * (lat1 - lat2);
    distance = Math.sqrt(dx * dx + dy * dy);
  } catch (error) {
    // Unbekannte PLZ
    distance = 0;
  }
  return distance;
}

function contact (req, res) {
  const contactValues = req.body.contact;

  emailService.sendMail({
    preferredLanguage: 'de',
    template: 'contact',
    to: 'print4life@fablab-luebeck.de',
    cc: contactValues.email,
    locals:
        {

          receiverName: 'print4life-Team',
          contactName: contactValues.name,
          subject: contactValues.subject,
          content: contactValues.message,
          contactEmail: contactValues.email
        }
  });
  res.status(200).send();
}

export default {
  calculateDistance,
  contact
};
