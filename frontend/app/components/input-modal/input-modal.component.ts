import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalButton } from '../../helper/modal.button';

@Component({
  selector: 'app-input-modal',
  templateUrl: './input-modal.component.html',
  styleUrls: ['./input-modal.component.css']
})
export class InputModalComponent implements OnInit {
  @Input() inputLabel: String;
  @Input() title: String;
  @Input() button1: ModalButton;
  inputString: String;
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

}
