import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {
  private emailSource = new BehaviorSubject<string>('');
  email$ = this.emailSource.asObservable();

  private tokenSource = new BehaviorSubject<string>('');
  token$ = this.tokenSource.asObservable();

  constructor() { }

  setEmail(email: string) {
    this.emailSource.next(email);
  }

  setToken(token: string) {
    this.tokenSource.next(token);
  }

  clear() {
    this.emailSource.next('');
    this.tokenSource.next('');
  }
}
