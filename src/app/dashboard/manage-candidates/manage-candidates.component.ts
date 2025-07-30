
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