import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPasswordCreateComponent } from './forgot-password-create.component';

describe('ForgotPasswordCreateComponent', () => {
  let component: ForgotPasswordCreateComponent;
  let fixture: ComponentFixture<ForgotPasswordCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ForgotPasswordCreateComponent]
    });
    fixture = TestBed.createComponent(ForgotPasswordCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
