import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';

interface Question {
  id: number;
  questionText: string;
  options: string[];
  correctAnswer: string;
  questionImage?: File;
  optionImages: (File | null)[];
}

interface QuestionFormGroup extends FormGroup {
  value: {
    questionText: string;
    options: string[];
    correctAnswer: string;
    questionImage: File | null;
    optionImages: (File | null)[];
  };
  controls: {
    questionText: FormControl;
    options: FormArray;
    correctAnswer: FormControl;
    questionImage: FormControl;
    optionImages: FormArray;
  };
}

@Component({
  selector: 'app-assessment-creation',
  templateUrl: './assessment-creation.component.html',
  styleUrls: ['./assessment-creation.component.css']
})
export class AssessmentCreationComponent implements OnInit {
  questions: Question[] = [];
  assessmentForm: FormGroup;
  answerOptions: string[] = ['A', 'B', 'C', 'D'];
  private questionCounter = 1;

  constructor(
    private router: Router,
    private fb: FormBuilder
  ) {
    this.assessmentForm = this.fb.group({
      questions: this.fb.array<QuestionFormGroup>([])
    });
  }

  ngOnInit() {
    // Add first question by default
    this.addQuestion();
    // Subscribe to form value changes to enable/disable submit button
    this.assessmentForm.valueChanges.subscribe(() => {
      // This will trigger change detection for the form's validity
    });
  }

  get questionsArray(): FormArray<QuestionFormGroup> {
    return this.assessmentForm.get('questions') as FormArray<QuestionFormGroup>;
  }

  // Helper method to check if the form is valid
  isFormValid(): boolean {
    if (!this.assessmentForm.valid) {
      return false;
    }
    
    // Additional validation to ensure all required fields are filled
    const questions = this.questionsArray.controls;
    for (const question of questions) {
      if (!question.valid) {
        return false;
      }
      
      // Check that at least one option is filled for each question
      const options = question.get('options') as FormArray;
      const hasAtLeastOneOption = options.controls.some(control => control.value && control.value.trim() !== '');
      if (!hasAtLeastOneOption) {
        return false;
      }
      
      // Check that a correct answer is selected
      if (!question.get('correctAnswer')?.value) {
        return false;
      }
    }
    
    return true;
  }

  onBackClick() {
    this.router.navigate(['/dashboard/interview-setup/create-assessment']);
  }

  addQuestion() {
    const newQuestion: Question = {
      id: this.questionCounter++,
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      optionImages: [null, null, null, null]
    };
    
    this.questions.push(newQuestion);
    
    // Add form group for the new question
    this.questionsArray.push(this.createQuestionGroup(newQuestion));
  }

  removeQuestion(index: number) {
    if (this.questionsArray.length > 1) {
      this.questions.splice(index, 1);
      this.questionsArray.removeAt(index);
    }
  }

  private createQuestionGroup(question: Question): QuestionFormGroup {
    const group = this.fb.group({
      questionText: [question.questionText, Validators.required],
      options: this.fb.array(question.options.map(opt => 
        this.fb.control(opt, Validators.required)
      )),
      correctAnswer: [question.correctAnswer, Validators.required],
      questionImage: [null],
      optionImages: this.fb.array(question.optionImages.map(() => this.fb.control(null)))
    }) as QuestionFormGroup;

    return group;
  }

  onFileSelected(event: Event, questionIndex: number, optionIndex?: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      if (typeof optionIndex === 'number') {
        // Update the form control for option image
        const optionImagesArray = (this.questionsArray.at(questionIndex).get('optionImages') as FormArray);
        optionImagesArray.at(optionIndex).setValue(file);
      } else {
        // Update the form control for question image
        this.questionsArray.at(questionIndex).get('questionImage')?.setValue(file);
      }
    }
  }

  getOptionControl(questionIndex: number, optionIndex: number): FormControl {
    const optionsArray = this.questionsArray.at(questionIndex).get('options') as FormArray;
    return optionsArray.at(optionIndex) as FormControl;
  }

  getOptionImageControl(questionIndex: number, optionIndex: number): FormControl {
    const optionImagesArray = this.questionsArray.at(questionIndex).get('optionImages') as FormArray;
    return optionImagesArray.at(optionIndex) as FormControl;
  }

  getCorrectAnswerControl(questionIndex: number): FormControl {
    return this.questionsArray.at(questionIndex).get('correctAnswer') as FormControl;
  }

  // Get image preview URL for display
  getImagePreview(file: File): string {
    if (!file) return '';
    return URL.createObjectURL(file);
  }

  // Remove uploaded file
  removeFile(questionIndex: number, fileType: 'questionImage' | 'optionImage', optionIndex?: number): void {
    if (fileType === 'questionImage') {
      this.questionsArray.at(questionIndex).get('questionImage')?.setValue(null);
    } else if (fileType === 'optionImage' && typeof optionIndex === 'number') {
      const optionImagesArray = this.questionsArray.at(questionIndex).get('optionImages') as FormArray;
      optionImagesArray.at(optionIndex).setValue(null);
    }
  }

  // Trigger file input click
  triggerFileInput(event: Event, fileInput: HTMLInputElement): void {
    event.preventDefault();
    event.stopPropagation();
    fileInput.click();
  }

  onSubmit() {
    if (this.assessmentForm.valid) {
      console.log('Form submitted:', this.assessmentForm.value);
      // Navigate to preview page with the form data
      this.router.navigate(['/dashboard/assessment-preview'], { 
        state: { assessmentData: this.assessmentForm.value }
      });
    } else {
      // Mark all fields as touched to show validation messages
      this.assessmentForm.markAllAsTouched();
      // Scroll to the first invalid control
      const firstInvalid = document.querySelector('.ng-invalid');
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }
}
