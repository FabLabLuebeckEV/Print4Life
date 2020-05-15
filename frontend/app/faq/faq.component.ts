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
    name : '',
    email : '',
    message: ''
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
    const okButton = new ModalButton('Ok', 'btn btn-primary', 'Ok');

    console.log(this.contactData);
    this.serviceService.sendContactForm({contact: this.contactData}).catch();
    this.modalService.openMsgModal(
      'Erfolgreich verschickt',
      'modal-header header-success',
      ['Du erhältst eine Kopie deiner Nachricht per Email', 'Unser Team wird sich bald bei dir melden'],
      okButton,
      undefined
    ).result.then(async (login) => {
    }).catch((err) => {
    });
  }
}
