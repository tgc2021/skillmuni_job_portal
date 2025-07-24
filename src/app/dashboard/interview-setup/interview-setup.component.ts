import { Component, OnInit, HostListener } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";

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

@Component({
  selector: "app-interview-setup",
  templateUrl: "./interview-setup.component.html",
  styleUrls: ["./interview-setup.component.css"],
})
export class InterviewSetupComponent implements OnInit {
  interviewForm!: FormGroup;
  roundTypes = ["Assessment", "Online", "Offline"];
  selectedType = "";
  typeDropdownOpen = false;
  step = 1;

  previousAssessments = ["Java Test", "Soft Skills Round", "Logical Test"];
  assessmentDropdownOpen = false;
  selectedAssessment = "";
  isAssessmentAdded: boolean = false;

  // Calendar properties
  currentMonth: number;
  currentYear: number;
  startDate: Date | null = null;
  endDate: Date | null = null;
  selectedHours: number = 0;
  selectedMinutes: number = 0;
  calendarDays: CalendarDay[] = [];
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
    const today = new Date();
    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();
  }

  ngOnInit() {
    this.interviewForm = this.fb.group({
      roundName: ["", Validators.required],
      roundType: ["", Validators.required],
      schedulingType: ["calendar"],
      assessmentDeadline: [""],
      manualDeadline: [""],
      minPassingScore: [
        "",
        [Validators.required, Validators.min(20), Validators.max(100)],
      ],
      assessmentLink: [""],
      interviewLocation: ["", Validators.required], 
    });

    this.generateCalendar();

    // If user returned from PreviewAssessmentComponent
    const navigation = window.history.state;
    if (navigation?.assessmentConfirmed) {
      this.selectedType = "Assessment";
      this.interviewForm.get("roundType")?.setValue("Assessment");
      this.selectedAssessment =
        navigation.assessmentTitle || "Custom Assessment";
      this.isAssessmentAdded = true;
      this.setAssessmentValidators(true);
    }

    this.interviewForm.get("assessmentLink")?.valueChanges.subscribe((link) => {
      const trimmed = link?.trim();
      if (trimmed) {
        this.isAssessmentAdded = true;
        this.setAssessmentValidators(true);
      } else {
        this.isAssessmentAdded = false;
        this.setAssessmentValidators(false);
      }
    });
  }

  // Calendar methods
  generateCalendar() {
    this.calendarDays = [];
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    const today = new Date();

    // Add days from previous month
    const firstDayWeekday = firstDay.getDay();
    for (let i = firstDayWeekday - 1; i >= 0; i--) {
      const prevDate = new Date(this.currentYear, this.currentMonth, -i);
      this.calendarDays.push({
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
      const currentDate = new Date(this.currentYear, this.currentMonth, day);
      const isInRange = this.isDateInRange(currentDate);
      const isStart = this.isStartDate(currentDate);
      const isEnd = this.isEndDate(currentDate);

      this.calendarDays.push({
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

    const remainingCells = 42 - this.calendarDays.length;
    for (let day = 1; day <= remainingCells; day++) {
      const nextDate = new Date(this.currentYear, this.currentMonth + 1, day);
      this.calendarDays.push({
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

  // Check if a date is in the past (excluding today)
  isPastDate(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  }

  selectDate(day: CalendarDay) {
    if (day.otherMonth || this.isPastDate(day.fullDate)) return;

    const clickedDate = day.fullDate;

    // Reset selection if clicking the same date twice or if we're starting a new selection
    if (this.startDate && this.endDate) {
      this.startDate = clickedDate;
      this.endDate = null;
    }
    // Set start date if not set
    else if (!this.startDate) {
      this.startDate = clickedDate;
    }
    // Set end date (must be after start date)
    else if (clickedDate > this.startDate) {
      this.endDate = clickedDate;
    }
    // If clicked date is before start date, make it the new start date
    else {
      this.startDate = clickedDate;
      this.endDate = null;
    }

    this.updateCalendarDays();
  }

  // Close all dropdowns when clicking outside
  @HostListener("document:click", ["$event"])
  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest(".custom-dropdown")) {
      this.typeDropdownOpen = false;
      this.assessmentDropdownOpen = false;
    }
  }

  updateCalendarDays() {
    this.calendarDays.forEach((day) => {
      const currentDate = day.fullDate;
      day.selected = false;
      day.inRange = false;
      day.isStart = false;
      day.isEnd = false;

      if (
        this.startDate &&
        !this.endDate &&
        this.isSameDay(currentDate, this.startDate)
      ) {
        day.selected = true;
        day.isStart = true;
      } else if (this.startDate && this.endDate) {
        if (this.isSameDay(currentDate, this.startDate)) {
          day.isStart = true;
          day.inRange = true;
        } else if (this.isSameDay(currentDate, this.endDate)) {
          day.isEnd = true;
          day.inRange = true;
        } else if (currentDate > this.startDate && currentDate < this.endDate) {
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

  isDateInRange(date: Date): boolean {
    if (!this.startDate || !this.endDate) return false;
    return date > this.startDate && date < this.endDate;
  }

  isStartDate(date: Date): boolean {
    return this.startDate ? this.isSameDay(date, this.startDate) : false;
  }

  isEndDate(date: Date): boolean {
    return this.endDate ? this.isSameDay(date, this.endDate) : false;
  }

  previousMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar();
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar();
  }

  getMonthName(monthIndex: number): string {
    return this.monthNames[monthIndex];
  }

  // Toggle Round Type Dropdown
  toggleTypeDropdown() {
    this.typeDropdownOpen = !this.typeDropdownOpen;
  }

// When selecting a round type
selectType(type: string) {
  this.selectedType = type;
  this.interviewForm.get("roundType")?.setValue(type);
  this.typeDropdownOpen = false;
  
  // Reset Interview Location field when type changes to Online
  if (this.selectedType !== 'Offline') {
    this.interviewForm.get("interviewLocation")?.reset();
  }
}


  // Toggle Assessment Dropdown
  toggleAssessmentDropdown() {
    this.assessmentDropdownOpen = !this.assessmentDropdownOpen;
  }

  selectAssessment(a: string) {
    this.selectedAssessment = a;
    this.isAssessmentAdded = true;
    this.assessmentDropdownOpen = false;
    this.setAssessmentValidators(true);
  }

  // Apply or clear validators for assessment fields
  private setAssessmentValidators(isRequired: boolean) {
    const deadlineCtrl = this.interviewForm.get("assessmentDeadline");
    const scoreCtrl = this.interviewForm.get("minPassingScore");

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
  }

  // Form validation helper
  isFormValid(): boolean {
    if (!this.interviewForm.valid) return false;
    if (!this.interviewForm.get("roundName")?.value || !this.selectedType)
      return false;
    if (this.selectedType === "Assessment" && !this.isAssessmentAdded)
      return false;
    if (
      this.selectedType === "Online" &&
      this.schedulingTypeValue === "calendar" &&
      (!this.startDate || !this.endDate)
    )
      return false;
    return true;
  }

  // Array to store all rounds
  rounds: any[] = [];

  // Reset form to initial state
  private resetForm() {
    this.interviewForm.reset({ schedulingType: "calendar" });
    this.selectedType = "";
    this.selectedAssessment = "";
    this.isAssessmentAdded = false;
    this.startDate = null;
    this.endDate = null;
    this.selectedHours = 0;
    this.selectedMinutes = 0;
    this.generateCalendar();
  }

  // Add another round
  addRound() {
    if (this.isFormValid()) {
      const roundData = {
        ...this.interviewForm.value,
        roundType: this.selectedType,
        startDate: this.startDate,
        endDate: this.endDate,
        selectedTime: `${this.selectedHours
          .toString()
          .padStart(2, "0")}:${this.selectedMinutes
          .toString()
          .padStart(2, "0")}`,
      };

      this.rounds.push(roundData);
      console.log("Added Round:", roundData);
      this.resetForm();
    } else {
      this.interviewForm.markAllAsTouched();
    }
  }

  // Navigate to sort step with all rounds
  goToSortStep() {
    if (this.rounds.length === 0 && !this.isFormValid()) {
      this.interviewForm.markAllAsTouched();
      return;
    }

    // Add current form data if valid
    if (this.isFormValid()) {
      this.addRound();
    }

    // Proceed with all rounds
    console.log("All Rounds:", this.rounds);
    this.step = 2;
    // this.router.navigate(['/sort-rounds'], { state: { rounds: this.rounds } });
  }

  onBackClick() {
    this.router.navigate(["/dashboard"]);
  }

  onCreateAssessment() {
    this.router.navigate(["/dashboard/interview-setup/create-assessment"]);
  }

  get schedulingTypeValue() {
    return this.interviewForm.get("schedulingType")?.value;
  }
}
