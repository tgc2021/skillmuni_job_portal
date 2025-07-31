



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
}

@Component({
  selector: 'app-manage-candidates',
  templateUrl: './manage-candidates.component.html',
  styleUrls: ['./manage-candidates.component.css']
})
export class ManageCandidatesComponent implements OnInit {
  candidates: Candidate[] = [];
  activeTab: 'applied' | 'round1' | 'round2' | 'round3' = 'applied';

  showConfirmMovePopup = false;
  showNoCandidatesPopup = false;
  showAfterConfirmMovePopup = false;

  // Returns true if the candidate should have their checkbox locked (already reviewed)
  isCandidateLocked(candidate: Candidate): boolean {
    // If candidate is not in the current round, or if they have already been reviewed in this round
    // Candidates in the current round and not selected are not locked
    // Candidates in previous rounds or not selected in previous move are locked
    if (candidate.currentRound !== this.activeTab) {
      return true;
    }
    // Optionally, you can add more logic if you want to lock candidates who were not selected in the last move
    return false;
  }

  getCurrentRoundNumber(): number {
    // Map tab keys to round numbers
    const tabOrder = ['applied', 'round1', 'round2', 'round3'];
    const currentIndex = tabOrder.indexOf(this.activeTab);
    // 'applied' is not a round, so for 'applied' return 0, for 'round1' return 1, etc.
    return currentIndex > 0 ? currentIndex : 1;
  }

  getNextRoundNumber(): number {
    // Map tab keys to round numbers
    const tabOrder = ['applied', 'round1', 'round2', 'round3'];
    const currentIndex = tabOrder.indexOf(this.activeTab);
    // If already at last round, return last round number
    if (currentIndex === -1 || currentIndex >= tabOrder.length - 1) {
      return tabOrder.length - 1; // round3 is 3
    }
    return currentIndex + 1; // e.g., applied (0) -> 1, round1 (1) -> 2
  }

  // Sample candidates data
  private sampleCandidates: Candidate[] = [
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
      id: '3',
      name: 'Oliver Bennett',
      appliedDate: '28/6/2025',
      credits: 500,
      proficiencyLevel: 'Advanced',
      eligibility: 'Eligible',
      selected: true,
      currentRound: 'applied'
    },
    {
      id: '4',
      name: 'Amelia Clarke',
      appliedDate: '28/6/2025',
      credits: 500,
      proficiencyLevel: 'Intermediate',
      eligibility: 'Eligible',
      selected: false,
      currentRound: 'applied'
    },
    {
      id: '5',
      name: 'Tunde Okoye',
      appliedDate: '28/6/2025',
      credits: 500,
      proficiencyLevel: 'Intermediate',
      eligibility: 'Eligible',
      selected: false,
      currentRound: 'applied'
    },
    {
      id: '6',
      name: 'Isabela Costa',
      appliedDate: '28/6/2025',
      credits: 500,
      proficiencyLevel: 'Beginner',
      eligibility: 'Not Eligible',
      selected: false,
      currentRound: 'applied'
    },
    {
      id: '7',
      name: 'Thabo Nkosi',
      appliedDate: '28/6/2025',
      credits: 500,
      proficiencyLevel: 'Beginner',
      eligibility: 'Not Eligible',
      selected: false,
      currentRound: 'applied'
    }
  ];

  constructor(
    private apiService: ApiService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.loadCandidates();
  }

  onBackClick(): void {
    this.location.back();
  }

  setActiveTab(tab: 'applied' | 'round1' | 'round2' | 'round3'): void {
    this.activeTab = tab;
  }


  get filteredCandidates(): Candidate[] {
    return this.candidates.filter(candidate => candidate.currentRound === this.activeTab);
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

  moveToNextRound(): void {
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
    });
    this.activeTab = nextRound;
    this.showConfirmMovePopup = false;
    setTimeout(() => {
      this.showAfterConfirmMovePopup = true;
    }, 0);
  }
  pauseApplications(): void {
    // TODO: Add logic to pause applications (e.g., update job status)
    this.showAfterConfirmMovePopup = false;
  }

  keepAcceptingApplications(): void {
    // TODO: Add logic to keep accepting applications (e.g., update job status)
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

  private loadCandidates(): void {
    // In a real app, you would fetch candidates from a service
    // For now, we'll use the sample data
    this.candidates = [...this.sampleCandidates];
  }
}