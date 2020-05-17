import { Component, OnInit, Input } from '@angular/core';
import { ModalService } from '../services/modal.service';
import { ModalButton } from '../helper/modal.button';
import { MessageModalComponent } from '../components/message-modal/message-modal.component';
import { ServiceService } from '../services/service.service';

import { routes } from '../config/routes';
import { NavigationService } from '../services/navigation.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
  pressRoute = `/${routes.paths.frontend.press.root}`;

  @Input()
  sideloaded: boolean;

  contactData = {
    name: '',
    email: '',
    message: '',
    dsgvo: false
  };

  constructor(
    private serviceService: ServiceService,
    private modalService: ModalService,
    private navigationService: NavigationService
  ) {

  }

  ngOnInit() {
    console.log('sideloaded: ', this.sideloaded);
    if (this.sideloaded === undefined || !this.sideloaded) {
      this.sideloaded = false;
      this.navigationService.setStatic(true);
    }
  }


  async sendContactMessage() {
    if (!this.contactData.dsgvo) {
      const okButton = new ModalButton('Ok', 'btn btn-primary', 'Ok');

      this.modalService.openMsgModal(
        'DSGVO akzeptieren',
        'modal-header',
        ['Bitte akzeptiere die Verarbeitung deiner Daten'],
        okButton,
        undefined
      );
    } else if (!this.contactData.email.includes('@') || this.contactData.email === '') {
      const okButton = new ModalButton('Ok', 'btn btn-primary', 'Ok');

      this.modalService.openMsgModal(
        'Email überprüfen',
        'modal-header',
        ['Bitte überprüfe die eingabe deiner E-Mail-Adresse'],
        okButton,
        undefined
      );
    } else if (this.contactData.message === '') {
      const okButton = new ModalButton('Ok', 'btn btn-primary', 'Ok');

      this.modalService.openMsgModal(
        'Nachricht überprüfen',
        'modal-header',
        ['Bitte überprüfe die eingabe deiner Nachricht'],
        okButton,
        undefined
      );
    } else if (this.contactData.name === '') {
      const okButton = new ModalButton('Ok', 'btn btn-primary', 'Ok');

      this.modalService.openMsgModal(
        'Namen überprüfen',
        'modal-header',
        ['Bitte überprüfe die eingabe deines Namens'],
        okButton,
        undefined
      );
    } else {
      const okButton = new ModalButton('Ok', 'btn btn-primary', 'Ok');

      console.log(this.contactData);
      this.serviceService.sendContactForm({ contact: this.contactData }).catch();
      this.modalService.openMsgModal(
        'Erfolgreich verschickt',
        'modal-header',
        ['Du erhältst eine Kopie deiner Nachricht per Email', 'Unser Team wird sich bald bei dir melden'],
        okButton,
        undefined
      ).result.then(async (login) => {
      }).catch((err) => {
      });
    }
  }
}
