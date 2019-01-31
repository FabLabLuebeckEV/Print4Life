import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalButton } from '../message-modal/message-modal.component';
import { OctoprintService } from 'frontend/app/services/octoprint.service';

@Component({
  selector: 'app-octoprint-modal',
  templateUrl: './octoprint-modal.component.html',
  styleUrls: ['./octoprint-modal.component.css']
})
export class OctoprintModalComponent implements OnInit {
  @Input() addressLabel: String;
  @Input() apiKeyLabel: String;
  @Input() fileSelectLabel: String;
  @Input() selectItems: Array<any>;
  @Input() title: String;
  @Input() button1: ModalButton;
  @Input() button2: ModalButton;
  addressString: String;
  apiKeyString: String;
  selectedItem: any;
  titleClass: String;

  constructor(private activeModal: NgbActiveModal, private octoprintService: OctoprintService) { }

  ngOnInit() {
    if (!this.titleClass) {
      this.titleClass = 'modal-header header-primary';
    }
  }

  close(input: String) {
    this.activeModal.close(input);
  }

  async printFile(fileId: String, apiKey: String, address: String) {
    try {
      await this.octoprintService.uploadFile(fileId, address, apiKey);
      await this.octoprintService.printFile(fileId, address, apiKey);
      this.close('dismiss');
    } catch (err) { }
  }

}
