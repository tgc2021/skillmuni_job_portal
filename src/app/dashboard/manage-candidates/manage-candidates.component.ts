

import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ApiService } from '../../services/api.service';

interface Candidate {
  id: string;
  name: string;
  appliedDate: string;
  credits: number;
  proficiencyLevel: 'Advanced' | 'Intermediate' | 'Beginner';
  eligibility: 'Eligible' | 'Not Eligible';
  selected: boolean;
  currentRound: 'applied' | 'round1' | 'round2' | 'round3';
  
  // Assessment specific fields
  assessmentScore?: number;
  assessmentResult?: 'Pass' | 'Fail';
  conductedOn?: string;
  
  // Interview specific fields
  interviewScheduled?: boolean;
  interviewDateTime?: string;
  interviewStatus?: 'Not Scheduled' | 'Scheduled' | 'Conducted';
  interviewResult?: 'Pass' | 'Fail';
  rating?: number;
  feedback?: string;
}

interface RoundConfig {
  name: string;
  deadline: string;
  status: 'Ongoing' | 'Passed';
  type: 'applied' | 'assessment' | 'interview';
  minScore?: number;
  calendarPublished?: boolean;
  startDate?: string;
  endDate?: string;
  interviewDuration?: string;
}

@Component({
  selector: 'app-manage-candidates',
  templateUrl: './manage-candidates.component.html',
  styleUrls: ['./manage-candidates.component.css']
})
export class ManageCandidatesComponent implements OnInit {
  candidates: Candidate[] = [];
  activeTab: 'applied' | 'round1' | 'round2' | 'round3' = 'applied';

  // Get dynamic move button text based on active tab
  getMoveButtonText(): string {
    switch (this.activeTab) {
      case 'applied':
        return 'Move to Round 1';
      case 'round1':
        return 'Move to Round 2';
      case 'round2':
        return 'Move to Final Round';
      case 'round3':
        return 'Offer Job';
      default:
        return 'On to the next';
    }
  }

  getRowClass(candidate: Candidate): any {
    const result: any = {};
    result[this.gridLayoutClass] = true;
    if (this.isCandidateLocked(candidate)) {
      result['row-locked'] = true;
    }
    return result;
  }

  showConfirmMovePopup = false;
  showNoCandidatesPopup = false;
  showAfterConfirmMovePopup = false;
  showCalendarInfo = false;
  showCandidateEvaluation: { [key: string]: boolean } = {};

  // Round configurations
  roundConfigs: { [key: string]: RoundConfig } = {
    applied: {
      name: 'Applied',
      deadline: '',
      status: 'Ongoing',
      type: 'applied'
    },
    round1: {
      name: 'Round 1',
      deadline: '12/7/25',
      status: 'Ongoing',
      type: 'assessment',
      minScore: 80
    },
    round2: {
      name: 'Round 2',
      deadline: '28/7/25',
      status: 'Ongoing',
      type: 'interview',
      calendarPublished: true,
      startDate: '20/7/25',
      endDate: '28/7/25',
      interviewDuration: '00:30'
    },
    round3: {
      name: 'Round 3',
      deadline: '5/8/25',
      status: 'Ongoing',
      type: 'interview',
      calendarPublished: false
    }
  };

  constructor(
    private apiService: ApiService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.loadCandidates();
    // Debug logging
    console.log('Component initialized');
    console.log('Initial candidates:', this.candidates);
    console.log('Active tab:', this.activeTab);
  }

  // Get current round configuration
  get currentRoundConfig(): RoundConfig {
    return this.roundConfigs[this.activeTab];
  }

  // Check if current round is assessment type
  get isAssessmentRound(): boolean {
    return this.currentRoundConfig?.type === 'assessment';
  }

  // Check if current round is interview type
  get isInterviewRound(): boolean {
    return this.currentRoundConfig?.type === 'interview';
  }

  // Check if current round is applied type
  get isAppliedRound(): boolean {
    return this.currentRoundConfig?.type === 'applied';
  }

  // Get table columns for current round
  get tableColumns(): string[] {
    if (this.isAppliedRound) {
      return ['No.', 'Candidate Name', 'Applied Date', 'Resume', 'Credits', 'Proficiency Level', 'Eligibility', 'Select'];
    } else if (this.isAssessmentRound) {
      return ['No.', 'Candidate Name', 'Conducted On', 'Assessment Score', 'Result', 'Select'];
    } else if (this.isInterviewRound) {
      return ['No.', 'Candidate Name', 'Key Actions', 'Status', 'Result', 'Select'];
    }
    return [];
  }

  // Get CSS class for grid layout
  get gridLayoutClass(): string {
    if (this.isAppliedRound) {
      return 'applied-grid';
    } else if (this.isAssessmentRound) {
      return 'assessment-grid';
    } else if (this.isInterviewRound) {
      return 'interview-grid';
    }
    return 'applied-grid';
  }

  // Check if move to next round button should be disabled
  get isMoveButtonDisabled(): boolean {
    if (this.isInterviewRound) {
      const candidatesWithResults = this.filteredCandidates.filter(c => c.interviewResult);
      const passedCandidates = this.filteredCandidates.filter(c => c.interviewResult === 'Pass');
      return candidatesWithResults.length === 0 || passedCandidates.length === 0;
    }
    return this.selectedCount === 0;
  }

  // Returns true if the candidate should have their checkbox locked
  isCandidateLocked(candidate: Candidate): boolean {
    if (candidate.currentRound !== this.activeTab) {
      return true;
    }
    
    // For assessment rounds, lock failed candidates
    if (this.isAssessmentRound && candidate.assessmentResult === 'Fail') {
      return true;
    }
    
    // For interview rounds, lock failed candidates
    if (this.isInterviewRound && candidate.interviewResult === 'Fail') {
      return true;
    }
    
    return false;
  }

  getCurrentRoundNumber(): number {
    const tabOrder = ['applied', 'round1', 'round2', 'round3'];
    const currentIndex = tabOrder.indexOf(this.activeTab);
    return currentIndex > 0 ? currentIndex : 1;
  }

  getNextRoundNumber(): number {
    const tabOrder = ['applied', 'round1', 'round2', 'round3'];
    const currentIndex = tabOrder.indexOf(this.activeTab);
    if (currentIndex === -1 || currentIndex >= tabOrder.length - 1) {
      return tabOrder.length - 1;
    }
    return currentIndex + 1;
  }

  onBackClick(): void {
    this.location.back();
  }

  setActiveTab(tab: 'applied' | 'round1' | 'round2' | 'round3'): void {
    this.activeTab = tab;
    this.showCalendarInfo = false;
    console.log('Active tab changed to:', tab);
    console.log('Filtered candidates:', this.filteredCandidates.length);
  }

  get filteredCandidates(): Candidate[] {
    const filtered = this.candidates.filter(candidate => candidate.currentRound === this.activeTab);
    return filtered;
  }

  get selectedCount(): number {
    return this.filteredCandidates.filter(c => c.selected).length;
  }

  get candidatesCounts() {
    return {
      applied: this.candidates.filter(c => c.currentRound === 'applied').length,
      round1: this.candidates.filter(c => c.currentRound === 'round1').length,
      round2: this.candidates.filter(c => c.currentRound === 'round2').length,
      round3: this.candidates.filter(c => c.currentRound === 'round3').length
    };
  }

  getNextRoundText(): string {
    switch (this.activeTab) {
      case 'applied': return 'Round 1';
      case 'round1': return 'Round 2';
      case 'round2': return 'Round 3';
      default: return '';
    }
  }

  getTabDisplayName(tab: string): string {
    switch (tab) {
      case 'applied': return 'Applied';
      case 'round1': return 'Round 1';
      case 'round2': return 'Round 2';
      case 'round3': return 'Round 3';
      default: return '';
    }
  }

  // Toggle calendar info display
  toggleCalendarInfo(): void {
    this.showCalendarInfo = !this.showCalendarInfo;
  }

  // Toggle candidate evaluation form
  toggleCandidateEvaluation(candidateId: string): void {
    this.showCandidateEvaluation[candidateId] = !this.showCandidateEvaluation[candidateId];
  }

  // Save candidate evaluation
  saveCandidateEvaluation(candidate: Candidate, rating: number, feedback: string, result: 'Pass' | 'Fail'): void {
    candidate.rating = rating;
    candidate.feedback = feedback;
    candidate.interviewResult = result;
    candidate.interviewStatus = 'Conducted';
    
    // Auto-select if passed
    if (result === 'Pass') {
      candidate.selected = true;
    } else {
      candidate.selected = false;
    }
    
    this.showCandidateEvaluation[candidate.id] = false;
  }

  // Schedule interview
  scheduleInterview(candidate: Candidate): void {
    candidate.interviewScheduled = true;
    candidate.interviewStatus = 'Scheduled';
    candidate.interviewDateTime = '25/7/2025 - 10:30 am';
  }

  moveToNextRound(): void {
    if (this.isMoveButtonDisabled) {
      this.showNoCandidatesPopup = true;
      return;
    }
    
    const selectedCandidates = this.filteredCandidates.filter(c => c.selected);
    if (selectedCandidates.length === 0) {
      this.showNoCandidatesPopup = true;
      return;
    }
    this.showConfirmMovePopup = true;
  }

  confirmMoveToNextRound(): void {
    const selectedCandidates = this.filteredCandidates.filter(c => c.selected);
    const nextRound = this.getNextRound();
    if (!nextRound) return;

    selectedCandidates.forEach(candidate => {
      candidate.currentRound = nextRound;
      candidate.selected = false;
      
      // Reset round-specific fields for next round
      if (this.isAssessmentRound) {
        delete candidate.assessmentScore;
        delete candidate.assessmentResult;
        delete candidate.conductedOn;
      } else if (this.isInterviewRound) {
        candidate.interviewScheduled = false;
        delete candidate.interviewDateTime;
        candidate.interviewStatus = 'Not Scheduled';
        delete candidate.interviewResult;
        delete candidate.rating;
        delete candidate.feedback;
      }
    });

    this.activeTab = nextRound;
    this.showConfirmMovePopup = false;
    setTimeout(() => {
      this.showAfterConfirmMovePopup = true;
    }, 0);
  }

  pauseApplications(): void {
    this.showAfterConfirmMovePopup = false;
  }

  keepAcceptingApplications(): void {
    this.showAfterConfirmMovePopup = false;
  }

  closeConfirmMovePopup(): void {
    this.showConfirmMovePopup = false;
  }

  closeNoCandidatesPopup(): void {
    this.showNoCandidatesPopup = false;
  }

  private getNextRound(): 'round1' | 'round2' | 'round3' | null {
    switch (this.activeTab) {
      case 'applied': return 'round1';
      case 'round1': return 'round2';
      case 'round2': return 'round3';
      default: return null;
    }
  }

  getProficiencyClass(level: string): string {
    return `proficiency-${level.toLowerCase()}`;
  }

  getEligibilityClass(eligibility: string): string {
    return eligibility === 'Eligible' ? 'eligibility-eligible' : 'eligibility-not-eligible';
  }

  getResultClass(result: string): string {
    return result === 'Pass' ? 'result-pass' : 'result-fail';
  }

  private loadCandidates(): void {
    // Enhanced sample data with assessment and interview fields

    this.candidates = [
      // Applied candidates
      {
        id: '1',
        name: 'Sonia Shaikh',
        appliedDate: '28/6/2025',
        credits: 500,
        proficiencyLevel: 'Advanced',
        eligibility: 'Eligible',
        selected: true,
        currentRound: 'applied'
      },
      {
        id: '2',
        name: 'James Carter',
        appliedDate: '28/6/2025',
        credits: 500,
        proficiencyLevel: 'Advanced',
        eligibility: 'Eligible',
        selected: true,
        currentRound: 'applied'
      },
      {
        id: '8',
        name: 'Priya Singh',
        appliedDate: '29/6/2025',
        credits: 400,
        proficiencyLevel: 'Intermediate',
        eligibility: 'Eligible',
        selected: false,
        currentRound: 'applied'
      },
      {
        id: '9',
        name: 'Rahul Mehra',
        appliedDate: '29/6/2025',
        credits: 350,
        proficiencyLevel: 'Beginner',
        eligibility: 'Not Eligible',
        selected: false,
        currentRound: 'applied'
      },
      {
        id: '10',
        name: 'Emily Chen',
        appliedDate: '30/6/2025',
        credits: 420,
        proficiencyLevel: 'Advanced',
        eligibility: 'Eligible',
        selected: false,
        currentRound: 'applied'
      },
      {
        id: '11',
        name: 'Mohammed Ali',
        appliedDate: '30/6/2025',
        credits: 390,
        proficiencyLevel: 'Intermediate',
        eligibility: 'Eligible',
        selected: false,
        currentRound: 'applied'
      },
      {
        id: '12',
        name: 'Sara Müller',
        appliedDate: '1/7/2025',
        credits: 410,
        proficiencyLevel: 'Advanced',
        eligibility: 'Eligible',
        selected: false,
        currentRound: 'applied'
      },
      {
        id: '13',
        name: 'Lucas Rossi',
        appliedDate: '1/7/2025',
        credits: 370,
        proficiencyLevel: 'Beginner',
        eligibility: 'Not Eligible',
        selected: false,
        currentRound: 'applied'
      },
      {
        id: '14',
        name: 'Ava Brown',
        appliedDate: '2/7/2025',
        credits: 430,
        proficiencyLevel: 'Intermediate',
        eligibility: 'Eligible',
        selected: false,
        currentRound: 'applied'
      },
      {
        id: '15',
        name: 'David Kim',
        appliedDate: '2/7/2025',
        credits: 410,
        proficiencyLevel: 'Advanced',
        eligibility: 'Eligible',
        selected: false,
        currentRound: 'applied'
      },
      {
        id: '16',
        name: 'Fatima Zahra',
        appliedDate: '3/7/2025',
        credits: 390,
        proficiencyLevel: 'Intermediate',
        eligibility: 'Eligible',
        selected: false,
        currentRound: 'applied'
      },
      {
        id: '17',
        name: 'John Smith',
        appliedDate: '3/7/2025',
        credits: 380,
        proficiencyLevel: 'Beginner',
        eligibility: 'Not Eligible',
        selected: false,
        currentRound: 'applied'
      },
      // Assessment round (Round 1)
      {
        id: '3',
        name: 'Oliver Bennett',
        appliedDate: '28/6/2025',
        credits: 500,
        proficiencyLevel: 'Advanced',
        eligibility: 'Eligible',
        selected: true,
        currentRound: 'round1',
        assessmentScore: 91,
        assessmentResult: 'Pass',
        conductedOn: '28/6/2025'
      },
      {
        id: '4',
        name: 'Amelia Clarke',
        appliedDate: '28/6/2025',
        credits: 500,
        proficiencyLevel: 'Intermediate',
        eligibility: 'Eligible',
        selected: false,
        currentRound: 'round1',
        conductedOn: 'Not Conducted'
      },
      {
        id: '5',
        name: 'Tunde Okoye',
        appliedDate: '28/6/2025',
        credits: 500,
        proficiencyLevel: 'Intermediate',
        eligibility: 'Eligible',
        selected: false,
        currentRound: 'round1',
        assessmentScore: 77,
        assessmentResult: 'Fail',
        conductedOn: '2/7/2025'
      },
      // Interview round (Round 2)
      {
        id: '6',
        name: 'Isabela Costa',
        appliedDate: '28/6/2025',
        credits: 500,
        proficiencyLevel: 'Beginner',
        eligibility: 'Not Eligible',
        selected: false,
        currentRound: 'round2',
        interviewScheduled: true,
        interviewDateTime: '25/7/2025 - 10:30 am',
        interviewStatus: 'Conducted',
        interviewResult: 'Pass',
        rating: 4.5,
        feedback: 'Good communication.'
      },
      {
        id: '7',
        name: 'Thabo Nkosi',
        appliedDate: '28/6/2025',
        credits: 500,
        proficiencyLevel: 'Beginner',
        eligibility: 'Not Eligible',
        selected: false,
        currentRound: 'round2',
        interviewScheduled: true,
        interviewDateTime: '26/7/2025 - 11:00 am',
        interviewStatus: 'Conducted',
        interviewResult: 'Fail',
        rating: 2.5,
        feedback: 'Needs improvement.'
      }
    ];
    
    console.log('Candidates loaded in loadCandidates():', this.candidates.length);
  }
}