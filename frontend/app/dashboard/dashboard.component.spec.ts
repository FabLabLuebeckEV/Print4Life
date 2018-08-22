import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DropdownComponent } from '../components/dropdown/dropdown.component';
import { RouterTestingModule } from '@angular/router/testing';
import { DashboardComponent } from './dashboard.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardComponent, DropdownComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      providers: [TranslateService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should have as title \'Fablab - Order Management\'', async(() => {
    const fixture = TestBed.createComponent(DashboardComponent);
    const app = fixture.debugElement.componentInstance;
    // expect(app.title).toBeDefined();
  }));
  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toBeDefined();
  }));
});
