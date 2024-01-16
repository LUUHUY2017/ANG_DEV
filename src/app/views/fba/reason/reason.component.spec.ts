import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FbaReasonComponent } from './reason.component';

describe('FbaReasonComponent', () => {
  let component: FbaReasonComponent;
  let fixture: ComponentFixture<FbaReasonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FbaReasonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FbaReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
