import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OctoprintModalComponent } from './octoprint-modal.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('OctoprintModalComponent', () => {
  let component: OctoprintModalComponent;
  let fixture: ComponentFixture<OctoprintModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OctoprintModalComponent],
      imports: [NgSelectModule, FormsModule, NgbModule.forRoot(), HttpClientTestingModule],
      providers: [NgbActiveModal]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OctoprintModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
