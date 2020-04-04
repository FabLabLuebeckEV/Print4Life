
import emailService from '../services/email.service';

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
  contact
};
