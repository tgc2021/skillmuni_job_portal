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

  previousAssessments = ['Java Test', 'Soft Skills Round', 'Logical Test'];
  assessmentDropdownOpen = false;
  selectedAssessment = '';
  isAssessmentAdded = false;
  assessmentLink = '';

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.interviewForm = this.fb.group({
      roundName: ['', Validators.required],
      roundType: ['', Validators.required],
      assessmentDeadline: [''],
      minPassingScore: ['', [Validators.required, Validators.min(20), Validators.max(100)]]
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
    if (this.interviewForm.valid && this.isAssessmentAdded) {
      const roundData = this.interviewForm.value;
      console.log('Added Round:', roundData);
      this.interviewForm.reset();
      this.selectedType = '';
      this.selectedAssessment = '';
      this.isAssessmentAdded = false;
      this.assessmentLink = '';
    } else {
      this.interviewForm.markAllAsTouched();
    }
  }

  goToSortStep() {
    if (this.interviewForm.valid && this.isAssessmentAdded) {
      this.step = 2;
    } else {
      this.interviewForm.markAllAsTouched();
    }
  }

  toggleAssessmentDropdown() {
    this.assessmentDropdownOpen = !this.assessmentDropdownOpen;
  }

  selectAssessment(a: string) {
    this.selectedAssessment = a;
    this.isAssessmentAdded = true;
    this.assessmentDropdownOpen = false;
    // Show deadline and minPassingScore fields
    this.interviewForm.get('assessmentDeadline')?.setValidators([Validators.required]);
    this.interviewForm.get('assessmentDeadline')?.updateValueAndValidity();
    this.interviewForm.get('minPassingScore')?.setValidators([Validators.required, Validators.min(20), Validators.max(100)]);
    this.interviewForm.get('minPassingScore')?.updateValueAndValidity();
  }

  onAssessmentLinkInput(link: string) {
    this.assessmentLink = link;
    if (link && link.trim() !== '') {
      this.isAssessmentAdded = true;
      this.interviewForm.get('assessmentDeadline')?.setValidators([Validators.required]);
      this.interviewForm.get('assessmentDeadline')?.updateValueAndValidity();
      this.interviewForm.get('minPassingScore')?.setValidators([Validators.required, Validators.min(20), Validators.max(100)]);
      this.interviewForm.get('minPassingScore')?.updateValueAndValidity();
    } else {
      this.isAssessmentAdded = false;
      this.interviewForm.get('assessmentDeadline')?.clearValidators();
      this.interviewForm.get('assessmentDeadline')?.updateValueAndValidity();
      this.interviewForm.get('minPassingScore')?.clearValidators();
      this.interviewForm.get('minPassingScore')?.updateValueAndValidity();
    }
  }

  onBackClick() {
    this.router.navigate(['/dashboard']);
  }

  // Add this method for navigation
  onCreateAssessment() {
    this.router.navigate(['/dashboard/interview-setup/create-assessment']);
  }
}
