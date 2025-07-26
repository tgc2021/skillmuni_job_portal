import { Component, OnInit, HostListener, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { Router } from "@angular/router";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";

interface CalendarDay {
  date: number;
  otherMonth: boolean;
  selected: boolean;
  inRange: boolean;
  isStart: boolean;
  isEnd: boolean;
  isToday: boolean;
  fullDate: Date;
}

interface Round {
  id: number;
  form: FormGroup;
  selectedType: string;
  typeDropdownOpen: boolean;
  selectedAssessment: string;
  assessmentDropdownOpen: boolean;
  isAssessmentAdded: boolean;
  currentMonth: number;
  currentYear: number;
  startDate: Date | null;
  endDate: Date | null;
  selectedHours: number;
  selectedMinutes: number;
  calendarDays: CalendarDay[];
  // New properties for sorting
  selectedOrder: number | null;
  sortDropdownOpen: boolean;
}

@Component({
  selector: "app-interview-setup",
  templateUrl: "./interview-setup.component.html",
  styleUrls: ["./interview-setup.component.css"],
})
export class InterviewSetupComponent implements OnInit {
  interviewForm!: FormGroup;
  roundTypes = ["Assessment", "Online", "Offline"];
  step = 1;
  roundCounter = 1;

  // Array to store multiple rounds
  rounds: Round[] = [];

  previousAssessments = ["Java Test", "Soft Skills Round", "Logical Test"];

  dayHeaders = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  constructor(private fb: FormBuilder, private router: Router) {
    // Empty constructor
  }

  ngOnInit() {
    this.interviewForm = this.fb.group({
      rounds: this.fb.array([]),
    });

    // Add the first round
    this.addNewRound();

    // If user returned from PreviewAssessmentComponent
    const navigation = window.history.state;
    if (navigation?.assessmentConfirmed) {
      const firstRound = this.rounds[0];
      if (firstRound) {
        firstRound.selectedType = "Assessment";
        firstRound.form.get("roundType")?.setValue("Assessment");
        firstRound.selectedAssessment =
          navigation.assessmentTitle || "Custom Assessment";
        firstRound.isAssessmentAdded = true;
        this.setAssessmentValidators(firstRound, true);
      }
    }
  }

  get roundsFormArray(): FormArray {
    return this.interviewForm.get("rounds") as FormArray;
  }

  private createRoundForm(): FormGroup {
    const form = this.fb.group({
      roundName: ["", [Validators.required, Validators.minLength(1)]],
      roundType: ["", Validators.required],
      schedulingType: ["calendar"],
      assessmentDeadline: [""],
      manualDeadline: [""],
      minPassingScore: ["", [Validators.min(20), Validators.max(100)]],
      assessmentLink: [""],
      interviewLocation: [""],
    });

    // Subscribe to form value changes
    form.get("roundType")?.valueChanges.subscribe((type) => {
      const roundIndex = this.rounds.findIndex((r) => r.form === form);
      if (roundIndex !== -1 && type !== null) {
        this.updateFormValidation(this.rounds[roundIndex], type);
      }
    });

    form.get("schedulingType")?.valueChanges.subscribe(() => {
      const roundIndex = this.rounds.findIndex((r) => r.form === form);
      if (roundIndex !== -1) {
        this.updateFormValidation(
          this.rounds[roundIndex],
          this.rounds[roundIndex].selectedType
        );
      }
    });

    form.get("assessmentLink")?.valueChanges.subscribe((link) => {
      const roundIndex = this.rounds.findIndex((r) => r.form === form);
      if (roundIndex !== -1) {
        const round = this.rounds[roundIndex];
        const trimmed = link?.trim();
        if (trimmed) {
          round.isAssessmentAdded = true;
          this.setAssessmentValidators(round, true);
        } else {
          round.isAssessmentAdded = false;
          this.setAssessmentValidators(round, false);
        }
      }
    });

    return form;
  }

  addNewRound() {
    const today = new Date();
    const newRound: Round = {
      id: this.roundCounter++,
      form: this.createRoundForm(),
      selectedType: "",
      typeDropdownOpen: false,
      selectedAssessment: "",
      assessmentDropdownOpen: false,
      isAssessmentAdded: false,
      currentMonth: today.getMonth(),
      currentYear: today.getFullYear(),
      startDate: null,
      endDate: null,
      selectedHours: 0,
      selectedMinutes: 0,
      calendarDays: [],
      // Initialize new sorting properties
      selectedOrder: null,
      sortDropdownOpen: false,
    };

    this.generateCalendar(newRound);
    this.rounds.push(newRound);
    this.roundsFormArray.push(newRound.form);
  }

  removeRound(roundId: number) {
    const index = this.rounds.findIndex((r) => r.id === roundId);
    if (index !== -1 && this.rounds.length > 1) {
      this.rounds.splice(index, 1);
      this.roundsFormArray.removeAt(index);
      // Reset sort orders when rounds are removed
      this.resetSortOrder();
    }
  }

  // Handle drag and drop reordering (keeping for backward compatibility)
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.rounds, event.previousIndex, event.currentIndex);
    // Reset sort orders when drag and drop is used
    this.resetSortOrder();
  }

  /**
   * Toggle sort dropdown for a specific round
   */
  toggleSortDropdown(roundIndex: number) {
    // Close all other dropdowns
    this.rounds.forEach((round, index) => {
      if (index !== roundIndex) {
        round.sortDropdownOpen = false;
        round.typeDropdownOpen = false;
        round.assessmentDropdownOpen = false;
      }
    });

    // Toggle the clicked dropdown
    this.rounds[roundIndex].sortDropdownOpen =
      !this.rounds[roundIndex].sortDropdownOpen;
  }

  /**
   * Get available order numbers for dropdown
   */
  getAvailableOrders(currentRoundIndex: number): number[] {
    const totalRounds = this.rounds.length;
    const orders: number[] = [];

    for (let i = 1; i <= totalRounds; i++) {
      orders.push(i);
    }

    return orders;
  }

  /**
   * Check if an order number is already taken by another round
   */
  isOrderTaken(order: number, currentRoundIndex: number): boolean {
    return this.rounds.some(
      (round, index) =>
        index !== currentRoundIndex && round.selectedOrder === order
    );
  }

  /**
   * Select sort order for a round
   */
  selectSortOrder(roundIndex: number, order: number) {
    // Don't allow selection if order is already taken
    if (this.isOrderTaken(order, roundIndex)) {
      return;
    }

    this.rounds[roundIndex].selectedOrder = order;
    this.rounds[roundIndex].sortDropdownOpen = false;
  }

  /**
   * Reset all sort orders
   */
  resetSortOrder() {
    this.rounds.forEach((round) => {
      round.selectedOrder = null;
      round.sortDropdownOpen = false;
    });
  }

  /**
   * Check if all rounds have been assigned an order
   */
  canFinalize(): boolean {
    return this.rounds.every((round) => round.selectedOrder !== null);
  }

  /**
   * Finalize the setup with the selected order
   */
  finalizeSetup() {
    if (!this.canFinalize()) {
      alert(
        "Please assign an order to all interview rounds before finalizing."
      );
      return;
    }

    // Sort rounds according to selected order
    const sortedRounds = [...this.rounds].sort((a, b) => {
      return (a.selectedOrder || 0) - (b.selectedOrder || 0);
    });

    // Create final data structure
    const finalRoundsData = sortedRounds.map((round, index) => ({
      id: round.id,
      name: round.form.get("roundName")?.value,
      type: round.selectedType,
      order: round.selectedOrder,
      actualOrder: index + 1, // This will be 1, 2, 3... based on sort
      formData: round.form.value,
      startDate: round.startDate,
      endDate: round.endDate,
      selectedTime: `${round.selectedHours
        .toString()
        .padStart(2, "0")}:${round.selectedMinutes
        .toString()
        .padStart(2, "0")}`,
    }));

    console.log("Finalized Interview Rounds:", finalRoundsData);

    // Here you would typically save to backend
    // this.interviewService.saveInterviewRounds(finalRoundsData).subscribe({
    //   next: (response) => {
    //     console.log('Interview rounds saved successfully', response);
    //     this.router.navigate(['/dashboard']);
    //   },
    //   error: (error) => {
    //     console.error('Error saving interview rounds:', error);
    //   }
    // });

    // For now, show success message and navigate
    alert("Interview rounds have been finalized successfully!");
    this.router.navigate(["/dashboard"]);
  }

  /**
   * Checks if there is at least one valid round set up
   */
  hasAtLeastOneValidRound(): boolean {
    return (
      this.rounds.length > 0 &&
      this.rounds.some((round) => this.isRoundValid(round))
    );
  }

  /**
   * Checks if the user can proceed to the sort step
   */
  canGoToSort(): boolean {
    return this.hasAtLeastOneValidRound() && this.isFormValid();
  }

  /**
   * Navigates to the sort step if validation passes
   */
  navigateToSortIfValid(): void {
    if (this.canGoToSort()) {
      this.step = 2;
    } else if (!this.hasAtLeastOneValidRound()) {
      alert("Please set up at least one round before sorting.");
    } else if (!this.isFormValid()) {
      // Mark all forms as touched to show validation errors
      this.rounds.forEach((round) => round.form.markAllAsTouched());
      alert("Please complete all required fields before proceeding.");
    }
  }

  /**
   * Saves the sort order of the interview rounds (legacy method)
   */
  saveSortOrder() {
    // This method is replaced by finalizeSetup() but keeping for backward compatibility
    this.finalizeSetup();
  }

  // Calendar methods
  generateCalendar(round: Round) {
    round.calendarDays = [];
    const firstDay = new Date(round.currentYear, round.currentMonth, 1);
    const lastDay = new Date(round.currentYear, round.currentMonth + 1, 0);
    const today = new Date();

    // Add days from previous month
    const firstDayWeekday = firstDay.getDay();
    for (let i = firstDayWeekday - 1; i >= 0; i--) {
      const prevDate = new Date(round.currentYear, round.currentMonth, -i);
      round.calendarDays.push({
        date: prevDate.getDate(),
        otherMonth: true,
        selected: false,
        inRange: false,
        isStart: false,
        isEnd: false,
        isToday: false,
        fullDate: prevDate,
      });
    }

    // Add days of current month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const currentDate = new Date(round.currentYear, round.currentMonth, day);
      const isInRange = this.isDateInRange(round, currentDate);
      const isStart = this.isStartDate(round, currentDate);
      const isEnd = this.isEndDate(round, currentDate);

      round.calendarDays.push({
        date: day,
        otherMonth: false,
        selected: isStart || isEnd,
        inRange: isInRange,
        isStart: isStart,
        isEnd: isEnd,
        isToday: this.isSameDay(currentDate, today),
        fullDate: new Date(currentDate),
      });
    }

    const remainingCells = 42 - round.calendarDays.length;
    for (let day = 1; day <= remainingCells; day++) {
      const nextDate = new Date(round.currentYear, round.currentMonth + 1, day);
      round.calendarDays.push({
        date: day,
        otherMonth: true,
        selected: false,
        inRange: false,
        isStart: false,
        isEnd: false,
        isToday: false,
        fullDate: nextDate,
      });
    }
  }

  isPastDate(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  }

  selectDate(round: Round, day: CalendarDay) {
    if (day.otherMonth || this.isPastDate(day.fullDate)) return;

    const clickedDate = day.fullDate;

    if (round.startDate && round.endDate) {
      round.startDate = clickedDate;
      round.endDate = null;
    } else if (!round.startDate) {
      round.startDate = clickedDate;
    } else if (clickedDate > round.startDate) {
      round.endDate = clickedDate;
    } else {
      round.startDate = clickedDate;
      round.endDate = null;
    }

    this.updateCalendarDays(round);
  }

  updateCalendarDays(round: Round) {
    round.calendarDays.forEach((day) => {
      const currentDate = day.fullDate;
      day.selected = false;
      day.inRange = false;
      day.isStart = false;
      day.isEnd = false;

      if (
        round.startDate &&
        !round.endDate &&
        this.isSameDay(currentDate, round.startDate)
      ) {
        day.selected = true;
        day.isStart = true;
      } else if (round.startDate && round.endDate) {
        if (this.isSameDay(currentDate, round.startDate)) {
          day.isStart = true;
          day.inRange = true;
        } else if (this.isSameDay(currentDate, round.endDate)) {
          day.isEnd = true;
          day.inRange = true;
        } else if (
          currentDate > round.startDate &&
          currentDate < round.endDate
        ) {
          day.inRange = true;
        }
      }
    });
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  isDateInRange(round: Round, date: Date): boolean {
    if (!round.startDate || !round.endDate) return false;
    return date > round.startDate && date < round.endDate;
  }

  isStartDate(round: Round, date: Date): boolean {
    return round.startDate ? this.isSameDay(date, round.startDate) : false;
  }

  isEndDate(round: Round, date: Date): boolean {
    return round.endDate ? this.isSameDay(date, round.endDate) : false;
  }

  previousMonth(round: Round) {
    if (round.currentMonth === 0) {
      round.currentMonth = 11;
      round.currentYear--;
    } else {
      round.currentMonth--;
    }
    this.generateCalendar(round);
  }

  nextMonth(round: Round) {
    if (round.currentMonth === 11) {
      round.currentMonth = 0;
      round.currentYear++;
    } else {
      round.currentMonth++;
    }
    this.generateCalendar(round);
  }

  getMonthName(monthIndex: number): string {
    return this.monthNames[monthIndex];
  }

  // Close all dropdowns when clicking outside
  @HostListener("document:click", ["$event"])
  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest(".custom-dropdown")) {
      this.rounds.forEach((round) => {
        round.typeDropdownOpen = false;
        round.assessmentDropdownOpen = false;
        round.sortDropdownOpen = false;
      });
    }
  }

  toggleTypeDropdown(round: Round) {
    round.typeDropdownOpen = !round.typeDropdownOpen;
    // Close other dropdowns
    this.rounds.forEach((r) => {
      if (r !== round) {
        r.typeDropdownOpen = false;
        r.assessmentDropdownOpen = false;
        r.sortDropdownOpen = false;
      }
    });
  }

  selectType(round: Round, type: string) {
    round.selectedType = type;
    round.form.get("roundType")?.setValue(type);
    round.typeDropdownOpen = false;

    // Reset fields that might be conditionally required
    if (type !== "Assessment") {
      round.form.get("assessmentLink")?.reset();
      round.form.get("assessmentDeadline")?.reset();
      round.form.get("minPassingScore")?.reset();
      round.isAssessmentAdded = false;
    }

    if (type !== "Offline") {
      round.form.get("interviewLocation")?.reset();
    }

    if (type !== "Online") {
      round.startDate = null;
      round.endDate = null;
    }

    round.form.updateValueAndValidity();
  }

  toggleAssessmentDropdown(round: Round) {
    round.assessmentDropdownOpen = !round.assessmentDropdownOpen;
    // Close other dropdowns
    this.rounds.forEach((r) => {
      if (r !== round) {
        r.typeDropdownOpen = false;
        r.assessmentDropdownOpen = false;
        r.sortDropdownOpen = false;
      }
    });
  }

  selectAssessment(round: Round, assessment: string) {
    round.selectedAssessment = assessment;
    round.isAssessmentAdded = true;
    round.assessmentDropdownOpen = false;
    this.setAssessmentValidators(round, true);
  }

  private updateFormValidation(round: Round, type: string) {
    const form = round.form;
    const assessmentLinkControl = form.get("assessmentLink");
    const assessmentDeadlineControl = form.get("assessmentDeadline");
    const minPassingScoreControl = form.get("minPassingScore");
    const interviewLocationControl = form.get("interviewLocation");

    // Reset all validators first
    assessmentLinkControl?.clearValidators();
    assessmentDeadlineControl?.clearValidators();
    minPassingScoreControl?.clearValidators();
    interviewLocationControl?.clearValidators();

    if (type === "Assessment") {
      if (!round.isAssessmentAdded) {
        assessmentLinkControl?.setValidators([Validators.required]);
        assessmentDeadlineControl?.setValidators([Validators.required]);
        minPassingScoreControl?.setValidators([
          Validators.required,
          Validators.min(20),
          Validators.max(100),
        ]);
      }
    } else if (type === "Offline") {
      interviewLocationControl?.setValidators([Validators.required]);
    }

    // Update validation state
    assessmentLinkControl?.updateValueAndValidity();
    assessmentDeadlineControl?.updateValueAndValidity();
    minPassingScoreControl?.updateValueAndValidity();
    interviewLocationControl?.updateValueAndValidity();
  }

  private setAssessmentValidators(round: Round, isRequired: boolean) {
    const deadlineCtrl = round.form.get("assessmentDeadline");
    const scoreCtrl = round.form.get("minPassingScore");

    if (isRequired) {
      deadlineCtrl?.setValidators([Validators.required]);
      scoreCtrl?.setValidators([
        Validators.required,
        Validators.min(20),
        Validators.max(100),
      ]);
    } else {
      deadlineCtrl?.clearValidators();
      scoreCtrl?.clearValidators();
    }

    deadlineCtrl?.updateValueAndValidity();
    scoreCtrl?.updateValueAndValidity();
  }

  isRoundValid(round: Round): boolean {
    if (!round.form.get("roundName")?.value || !round.selectedType) {
      return false;
    }

    if (round.selectedType === "Assessment") {
      const hasAssessmentLink = !!round.form
        .get("assessmentLink")
        ?.value?.trim();
      const isAssessmentValid =
        hasAssessmentLink &&
        round.form.get("assessmentDeadline")?.valid &&
        round.form.get("minPassingScore")?.valid;

      if (!round.isAssessmentAdded && !isAssessmentValid) {
        return false;
      }
    } else if (round.selectedType === "Online") {
      const schedulingType = round.form.get("schedulingType")?.value;
      if (schedulingType === "calendar") {
        if (!round.startDate || !round.endDate) return false;
      } else {
        const manualDeadline = round.form.get("manualDeadline")?.value;
        if (!manualDeadline) return false;
      }
    } else if (round.selectedType === "Offline") {
      const schedulingType = round.form.get("schedulingType")?.value;
      if (schedulingType === "calendar") {
        if (!round.startDate || !round.endDate) return false;
      } else {
        const manualDeadline = round.form.get("manualDeadline")?.value;
        if (!manualDeadline) return false;
      }
    }

    return true;
  }

  isFormValid(): boolean {
    return this.rounds.every((round) => this.isRoundValid(round));
  }

  addRound() {
    // Mark all current rounds as touched to show validation errors
    this.rounds.forEach((round) => {
      round.form.markAllAsTouched();
    });

    if (this.isFormValid()) {
      this.addNewRound();
    }
  }

  goToSortStep() {
    // Mark all rounds as touched to show validation errors
    this.rounds.forEach((round) => {
      round.form.markAllAsTouched();
    });

    if (!this.isFormValid()) {
      return;
    }

    // Collect all round data
    const allRoundsData = this.rounds.map((round) => ({
      ...round.form.value,
      roundType: round.selectedType,
      startDate: round.startDate,
      endDate: round.endDate,
      selectedTime: `${round.selectedHours
        .toString()
        .padStart(2, "0")}:${round.selectedMinutes
        .toString()
        .padStart(2, "0")}`,
    }));

    console.log("All Rounds:", allRoundsData);
    this.step = 2;
  }

  onBackClick() {
    this.router.navigate(["/dashboard"]);
  }

  onCreateAssessment() {
    this.router.navigate(["/dashboard/interview-setup/create-assessment"]);
  }

  getSchedulingTypeValue(round: Round) {
    return round.form.get("schedulingType")?.value;
  }

  // TrackBy function for ngFor optimization
  trackByRoundId(index: number, round: Round): number {
    return round.id;
  }
}
