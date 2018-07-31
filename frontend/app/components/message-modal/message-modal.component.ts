import { Component, OnInit, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

export class ModalButton {
  label: String;
  class: String;
  returnValue: String;

  constructor(l: String, c: String, r: String) {
    this.label = l;
    this.class = c;
    this.returnValue = r;
  }
}

@Component({
  selector: 'app-message-modal',
  templateUrl: './message-modal.component.html',
  styleUrls: ['./message-modal.component.css']
})
export class MessageModalComponent implements OnInit {
  @Input() title: String;
  @Input() msg: String;
  @Input() button1: ModalButton;
  @Input() button2: ModalButton;
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
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
