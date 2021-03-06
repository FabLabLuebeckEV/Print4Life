
import emailService from '../services/email.service';
import app from '../App';

function calculateDistance (x: number, y: number): number {
  let distance;
  try {
    const lat1 = (app.geolocations[x.toString()])[1];
    const lon1 = (app.geolocations[x.toString()])[0];
    const lat2 = (app.geolocations[y.toString()])[1];
    const lon2 = (app.geolocations[y.toString()])[0];
    const dx = 71.5 * (lon1 - lon2);
    const dy = 111.3 * (lat1 - lat2);
    distance = Math.sqrt(dx * dx + dy * dy);
  } catch (error) {
    // Unbekannte PLZ
    distance = -1;
  }
  return distance;
}

function contact (req, res) {
  const contactValues = req.body.contact;

  emailService.sendMail({
    preferredLanguage: 'de',
    template: 'contact',
    to: 'info@print4.life',
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
