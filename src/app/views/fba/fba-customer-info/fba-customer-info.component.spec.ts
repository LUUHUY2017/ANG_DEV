import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FbaCustomerInfoComponent } from './fba-customer-info.component';

describe('FbaCustomerInfoComponent', () => {
  let component: FbaCustomerInfoComponent;
  let fixture: ComponentFixture<FbaCustomerInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FbaCustomerInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FbaCustomerInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
