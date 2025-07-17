import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

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
import { DashboardComponent } from './dashboard/dashboard.component';
import { ViewAllJobsComponent } from './dashboard/view-all-jobs/view-all-jobs.component';
import { PostJobComponent } from './dashboard/post-job/post-job.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
    DashboardComponent,
    ViewAllJobsComponent,
    PostJobComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
