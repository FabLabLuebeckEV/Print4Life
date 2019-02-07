import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalButton } from '../../helper/modal.button';

@Component({
  selector: 'app-message-modal',
  templateUrl: './message-modal.component.html',
  styleUrls: ['./message-modal.component.css']
})
export class MessageModalComponent implements OnInit {
  @Input() title: String;
  @Input() titleClass: String;
  @Input() messages: Array<String>;
  @Input() button1: ModalButton;
  @Input() button2: ModalButton;
  @Input() link: String;
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    if (!this.titleClass) {
      this.titleClass = 'modal-header header-secondary';
    }
  }

  close(button) {
    let reason;
    if (button === 'button1') {
      reason = this.button1.returnValue;
    } else if (button === 'button2') {
      reason = this.button2.returnValue;
    }
    this.activeModal.close(reason);
  }

}
