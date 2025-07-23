import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  Validators,
  ValidationErrors
} from '@angular/forms';

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
export class AssessmentCreationComponent implements OnInit, OnDestroy {
  assessmentForm: FormGroup;
  answerOptions: string[] = ['A', 'B', 'C', 'D'];
  totalQuestions = 1;
  private questionCounter = 1;
  private imagePreviewUrls: Map<File, string> = new Map<File, string>();

  constructor(private router: Router, private fb: FormBuilder) {
    this.assessmentForm = this.fb.group({
      questions: this.fb.array<QuestionFormGroup>([])
    });
  }

  async ngOnInit(): Promise<void> {
    const storedData = sessionStorage.getItem('previewAssessmentData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        this.totalQuestions = parsedData.totalQuestions || 1;
        await this.restoreFromPreviewData(parsedData);
        return;
      } catch (e) {
        console.error('Failed to parse session assessment:', e);
      }
    }
    this.addQuestion();
  }

  ngOnDestroy(): void {
    this.imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
    this.imagePreviewUrls.clear();
  }

  get questionsArray(): FormArray<QuestionFormGroup> {
    return this.assessmentForm.get('questions') as FormArray<QuestionFormGroup>;
  }

  isFormValid(): boolean {
    if (!this.assessmentForm.valid) return false;

    for (const question of this.questionsArray.controls) {
      if (!question.valid) return false;

      const options = question.get('options') as FormArray;
      const optionImages = question.get('optionImages') as FormArray;
      const correctAnswer = question.get('correctAnswer')?.value;
      if (!correctAnswer) return false;

      const optionIndex = correctAnswer.charCodeAt(0) - 65;
      const optionText = options.at(optionIndex)?.value?.trim() || '';
      const optionImage = optionImages.at(optionIndex)?.value;
      if (!optionText && !optionImage) return false;
    }

    return true;
  }

  onBackClick(): void {
    this.router.navigate(['/dashboard/interview-setup/create-assessment']);
  }

  addQuestion(): void {
    this.questionsArray.push(this.createQuestionGroup());
  }

  removeQuestion(index: number): void {
    if (this.questionsArray.length > 1) {
      this.questionsArray.removeAt(index);
    }
  }

  private createQuestionGroup(): QuestionFormGroup {
    return this.fb.group({
      questionText: [''],
      options: this.fb.array(['', '', '', ''].map(() => this.fb.control(''))),
      correctAnswer: ['', Validators.required],
      questionImage: [null],
      optionImages: this.fb.array([null, null, null, null].map(() => this.fb.control(null)))
    }, { validators: [this.validateQuestion] }) as QuestionFormGroup;
  }

  private validateQuestion(group: FormGroup): ValidationErrors | null {
    const questionText = group.get('questionText')?.value;
    const questionImage = group.get('questionImage')?.value;

    if ((!questionText || questionText.trim() === '') && !questionImage) {
      return { questionRequired: true };
    }

    const options = group.get('options') as FormArray;
    const images = group.get('optionImages') as FormArray;
    const correct = group.get('correctAnswer')?.value;

    for (let i = 0; i < options.length; i++) {
      const text = options.at(i).value;
      const img = images.at(i).value;
      if (correct === String.fromCharCode(65 + i)) {
        if ((!text || text.trim() === '') && !img) {
          return { optionRequired: { index: i } };
        }
      }
    }

    return null;
  }

  onFileSelected(event: Event, questionIndex: number, optionIndex?: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      if (typeof optionIndex === 'number') {
        const optionImages = this.questionsArray.at(questionIndex).get('optionImages') as FormArray;
        optionImages.at(optionIndex).setValue(file);
      } else {
        this.questionsArray.at(questionIndex).get('questionImage')?.setValue(file);
      }
    }
  }

  getOptionControl(qIndex: number, oIndex: number): FormControl {
    return (this.questionsArray.at(qIndex).get('options') as FormArray).at(oIndex) as FormControl;
  }

  getOptionImageControl(qIndex: number, oIndex: number): FormControl {
    return (this.questionsArray.at(qIndex).get('optionImages') as FormArray).at(oIndex) as FormControl;
  }

  getCorrectAnswerControl(qIndex: number): FormControl {
    return this.questionsArray.at(qIndex).get('correctAnswer') as FormControl;
  }

  getImagePreview(file: File): string {
    if (!file) return '';
    if (!this.imagePreviewUrls.has(file)) {
      const url = URL.createObjectURL(file);
      this.imagePreviewUrls.set(file, url);
    }
    return this.imagePreviewUrls.get(file) || '';
  }

  private fileToDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }

  dataURLtoFile(dataUrl: string, filename: string): File {
    const arr = dataUrl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  async restoreFromPreviewData(data: any): Promise<void> {
    for (const q of data.questions) {
      const questionImageFile = q.questionImage
        ? this.dataURLtoFile(q.questionImage, 'question.png')
        : null;

      const optionImageFiles = await Promise.all(
        (q.optionImages || []).map((img: string | null, i: number) =>
          img ? this.dataURLtoFile(img, `option-${i}.png`) : null
        )
      );

      const group = this.fb.group({
        questionText: [q.question || ''],
        options: this.fb.array(q.options.map((opt: string) => this.fb.control(opt || ''))),
        correctAnswer: [q.correctAnswer, Validators.required],
        questionImage: [questionImageFile],
        optionImages: this.fb.array(optionImageFiles.map((f) => this.fb.control(f)))
      }, { validators: [this.validateQuestion] }) as QuestionFormGroup;

      this.questionsArray.push(group);
    }
  }

  removeFile(qIndex: number, type: 'questionImage' | 'optionImage', oIndex?: number): void {
    if (type === 'questionImage') {
      this.questionsArray.at(qIndex).get('questionImage')?.setValue(null);
    } else if (type === 'optionImage' && typeof oIndex === 'number') {
      const optionImages = this.questionsArray.at(qIndex).get('optionImages') as FormArray;
      optionImages.at(oIndex).setValue(null);
    }
  }

  triggerFileInput(event: Event, fileInput: HTMLInputElement): void {
    event.preventDefault();
    event.stopPropagation();
    fileInput.click();
  }

  async onSubmit(): Promise<void> {
    if (this.assessmentForm.valid) {
      const formData = this.assessmentForm.value;
      const navigation = window.history.state;

      const questions = await Promise.all(formData.questions.map(async (q: any) => {
        const questionImageUrl = q.questionImage ? await this.fileToDataURL(q.questionImage) : '';
        const optionImageUrls = await Promise.all(
          (q.optionImages || []).map(async (img: File | null) =>
            img ? await this.fileToDataURL(img) : null
          )
        );
        return {
          question: q.questionText,
          options: q.options,
          correctAnswer: q.correctAnswer,
          questionImage: questionImageUrl,
          optionImages: optionImageUrls
        };
      }));

      const previewData = {
        title: navigation.assessmentData?.title || 'Untitled Assessment',
        description: navigation.assessmentData?.description || '',
        totalQuestions: navigation.assessmentData?.totalQuestions || 1,
        questions
      };

      sessionStorage.setItem('previewAssessmentData', JSON.stringify(previewData));
      this.router.navigate(['/dashboard/interview-setup/preview-assessment']);
    } else {
      this.assessmentForm.markAllAsTouched();
      const firstInvalid = document.querySelector('.ng-invalid');
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }
}
