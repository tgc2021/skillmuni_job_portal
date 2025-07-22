import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentCreationComponent } from './assessment-creation.component';

describe('AssessmentCreationComponent', () => {
  let component: AssessmentCreationComponent;
  let fixture: ComponentFixture<AssessmentCreationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssessmentCreationComponent]
    });
    fixture = TestBed.createComponent(AssessmentCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
