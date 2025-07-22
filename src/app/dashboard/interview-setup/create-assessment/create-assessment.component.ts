import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-assessment',
  templateUrl: './create-assessment.component.html',
  styleUrls: ['./create-assessment.component.css']
})
export class CreateAssessmentComponent implements OnInit {
  assessmentForm!: FormGroup;

  constructor(private router: Router, private fb: FormBuilder) {}

  ngOnInit() {
    this.assessmentForm = this.fb.group({
      assessmentName: ['', Validators.required],
      totalQuestions: ['', [Validators.required, Validators.min(2), Validators.max(30)]]
    });
  }

  onBackClick() {
    this.router.navigate(['/dashboard/interview-setup']);
  }

  onSubmit() {
    if (this.assessmentForm.valid) {
      // Navigate to Assessment Creation step
      this.router.navigate(['/dashboard/interview-setup/assessment-creation']);
    } else {
      this.assessmentForm.markAllAsTouched();
    }
  }
}
