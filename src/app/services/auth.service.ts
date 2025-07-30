import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

export interface SignInRequest {
  email: string;
  password: string;
  idOrgnization?: number;
}

export interface SignInResponse {
  message: string;
  token: string;
  user: {
    username: string;
  };
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl =
    "https://www.skillmuni.in/Jobportal_web_api/api/UserAuth/signin";

  constructor(private http: HttpClient) {}

  signIn(credentials: SignInRequest): Observable<SignInResponse> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
    });
 
    // Set default organization ID if not provided
    const requestBody = {
      ...credentials,
      idOrgnization: credentials.idOrgnization || 130,
    };

    return this.http.post<SignInResponse>(this.apiUrl, requestBody, {
      headers,
    });
  }

  // Store token in sessionStorage
  setToken(token: string): void {
    sessionStorage.setItem("authToken", token);
  }

  // Get token from sessionStorage
  getToken(): string | null {
    return sessionStorage.getItem("authToken");
  }

  // Remove token from sessionStorage
  removeToken(): void {
    sessionStorage.removeItem("authToken");
  }
  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  sendOtp(email: string) {
    const url = 'http://www.skillmuni.co.in/Jobportal_web_api/api/UserAuth/send-otp';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, { email }, { headers });
  }

  verifyOtp(email: string, otp: string) {
    const url = 'http://www.skillmuni.co.in/Jobportal_web_api/api/UserAuth/verify-otp';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, { email, otp }, { headers });
  }
}
