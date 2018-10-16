import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputModalComponent } from './input-modal.component';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

describe('InputModalComponent', () => {
  let component: InputModalComponent;
  let fixture: ComponentFixture<InputModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InputModalComponent],
      providers: [NgbActiveModal],
      imports: [FormsModule, NgbModule.forRoot()]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
