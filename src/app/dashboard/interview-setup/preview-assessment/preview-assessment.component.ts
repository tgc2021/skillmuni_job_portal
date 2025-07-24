import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  questionImage?: string; // Changed from File to string to store data URL
  optionImages?: (string | null)[]; // Changed from File[] to string[]
}

// Helper function to safely get an option image URL
export function getOptionImage(question: Question, index: number): string | null {
  return question.optionImages?.[index] ?? null;
}

@Component({
  selector: 'app-preview-assessment',
  templateUrl: './preview-assessment.component.html',
  styleUrls: ['./preview-assessment.component.css']
})
export class PreviewAssessmentComponent implements OnInit {
  assessmentTitle: string = '';
  assessmentDescription: string = '';
  questions: Question[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Try to load from sessionStorage first
    const storedData = sessionStorage.getItem('previewAssessmentData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        this.assessmentTitle = parsedData.title || 'Untitled Assessment';
        this.assessmentDescription = parsedData.description || '';
        this.questions = parsedData.questions || [];
      } catch (e) {
        console.error('Error parsing stored assessment data:', e);
        this.redirectToCreation();
      }
    } else {
      // Fallback to history state if no sessionStorage data
      const navigation = window.history.state;
      if (navigation.assessmentData) {
        this.assessmentTitle = navigation.assessmentData.title || 'Untitled Assessment';
        this.assessmentDescription = navigation.assessmentData.description || '';
        this.questions = navigation.assessmentData.questions || [];
      } else {
        // No data found, redirect to creation
        this.redirectToCreation();
      }
    }
  }

  private redirectToCreation(): void {
    this.router.navigate(['/dashboard/interview-setup/assessment-creation']);
  }



  getOptionLetter(index: number): string {
    return String.fromCharCode(65 + index); // 65 is ASCII for 'A'
  }

  // Safely get an option image URL from a question
  getOptionImage(question: Question, index: number): string | null {
    return question.optionImages?.[index] ?? null;
  }

  // Get image preview URL (now directly using the data URL)
  getImagePreview(imageData: string): string {
    return imageData || '';
  }

  onBackClick() {
    // Get the current assessment data from sessionStorage
    const storedData = sessionStorage.getItem('previewAssessmentData');
    
    if (storedData) {
      try {
        const assessmentData = JSON.parse(storedData);
        // Navigate back to creation page with the stored data
        this.router.navigate(['/dashboard/interview-setup/assessment-creation'], {
          state: { assessmentData }
        });
        return;
      } catch (e) {
        console.error('Error parsing stored assessment data:', e);
      }
    }
    
    // Fallback navigation if no stored data
    this.router.navigate(['/dashboard/interview-setup/assessment-creation']);
  }

onSubmit() {
  sessionStorage.removeItem('previewAssessmentData');

  this.router.navigate(['/dashboard/interview-setup'], {
    state: {
      assessmentConfirmed: true,
      assessmentTitle: this.assessmentTitle // optional, to show the title
    }
  });
}


  ngOnDestroy() {
    // Revoke object URLs to prevent memory leaks
    this.questions.forEach(question => {
      if (question.questionImage) {
        URL.revokeObjectURL(this.getImagePreview(question.questionImage));
      }
      question.optionImages?.forEach(img => {
        if (img) {
          URL.revokeObjectURL(this.getImagePreview(img));
        }
      });
    });
  }
}
