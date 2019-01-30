import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalButton } from '../message-modal/message-modal.component';

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
  addressString: String;
  apiKeyString: String;
  selectedItem: any;
  titleClass: String;

  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() {
    if (!this.titleClass) {
      this.titleClass = 'modal-header header-primary';
    }
  }

  close(input) {
    this.activeModal.close(input);
  }

  public printFile(fileId: String, apiKey: String, address: String) {
    console.log(fileId);
  }

}
