import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layouts/header/header.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { LoginComponent } from './auth/login/login.component';
import { SplashScreenComponent } from './auth/splash-screen/splash-screen.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { CompanyProfileComponent } from './company-profile/company-profile.component';
import { ForgotPasswordEmailSentComponent } from './auth/forgot-password/forgot-password-email-sent/forgot-password-email-sent.component';
import { ForgotPasswordCreateComponent } from './auth/forgot-password/forgot-password-create/forgot-password-create.component';
import { ForgotPasswordSuccessComponent } from './auth/forgot-password/forgot-password-success/forgot-password-success.component';
import { ForgotPasswordService } from './auth/services/forgot-password.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    SplashScreenComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    CompanyProfileComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    // Import standalone components
    ForgotPasswordEmailSentComponent,
    ForgotPasswordCreateComponent,
    ForgotPasswordSuccessComponent
  ],
  providers: [
    ForgotPasswordService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
