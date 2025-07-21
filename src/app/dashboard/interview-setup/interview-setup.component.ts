import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-interview-setup',
  templateUrl: './interview-setup.component.html',
  styleUrls: ['./interview-setup.component.css']
})
export class InterviewSetupComponent implements OnInit {
  interviewForm!: FormGroup;
  roundTypes = ['Assessment', 'Online', 'Offline'];
  selectedType = '';
  typeDropdownOpen = false;
  step = 1;

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.interviewForm = this.fb.group({
      roundName: ['', Validators.required],
      roundType: ['', Validators.required]
    });
  }

  toggleTypeDropdown() {
    this.typeDropdownOpen = !this.typeDropdownOpen;
  }

  selectType(type: string) {
    this.selectedType = type;
    this.interviewForm.get('roundType')?.setValue(type);
    this.typeDropdownOpen = false;
  }

  addRound() {
    if (this.interviewForm.valid) {
      const roundData = this.interviewForm.value;
      console.log('Added Round:', roundData);
      this.interviewForm.reset();
      this.selectedType = '';
    } else {
      this.interviewForm.markAllAsTouched();
    }
  }

  goToSortStep() {
    if (this.interviewForm.valid) {
      this.step = 2;
    } else {
      this.interviewForm.markAllAsTouched();
    }
  }

  selectedAssessmentOption: string = '';

selectAssessmentOption(option: string) {
  this.selectedAssessmentOption = option;
  // Trigger next step or logic based on this selection
}
previousAssessments = ['Java Test', 'Soft Skills Round', 'Logical Test'];
assessmentDropdownOpen = false;
selectedAssessment = '';

toggleAssessmentDropdown() {
  this.assessmentDropdownOpen = !this.assessmentDropdownOpen;
}

selectAssessment(a: string) {
  this.selectedAssessment = a;
  this.assessmentDropdownOpen = false;
}


  onBackClick() {
    this.router.navigate(['/dashboard']);
  }
}
