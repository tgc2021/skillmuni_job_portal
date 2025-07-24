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
    const savedData = sessionStorage.getItem('previewAssessmentData');
  
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        this.assessmentForm = this.fb.group({
          assessmentName: [parsed.title || '', Validators.required],
          totalQuestions: [parsed.totalQuestions || '', [Validators.required, Validators.min(2), Validators.max(30)]]
        });
        return;
      } catch (err) {
        console.error('Error parsing sessionStorage previewAssessmentData:', err);
      }
    }
  
    // Default form init if no saved data
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
      const assessmentData = {
        title: this.assessmentForm.get('assessmentName')?.value,
        totalQuestions: this.assessmentForm.get('totalQuestions')?.value
      };
  
      // ✅ Store in sessionStorage so AssessmentCreationComponent can use it
      sessionStorage.setItem('previewAssessmentData', JSON.stringify({
        ...assessmentData,
        questions: Array.from({ length: assessmentData.totalQuestions }).map(() => ({
          question: '',
          options: ['', '', '', ''],
          correctAnswer: '',
          questionImage: null,
          optionImages: [null, null, null, null]
        }))
      }));
  
      // ✅ Navigate to Assessment Creation
      this.router.navigate(['/dashboard/interview-setup/assessment-creation'], {
        state: { assessmentData }
      });
    } else {
      this.assessmentForm.markAllAsTouched();
    }
  }
  
  
}
