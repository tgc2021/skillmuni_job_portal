import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SplashScreenComponent } from './auth/splash-screen/splash-screen.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { CompanyProfileComponent } from './company-profile/company-profile.component';
import { ForgotPasswordSuccessComponent } from './auth/forgot-password/forgot-password-success/forgot-password-success.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ForgotPasswordVerifyComponent } from './auth/forgot-password/forgot-password-verify/forgot-password-verify.component';
import { ForgotPasswordResetComponent } from './auth/forgot-password/forgot-password-reset/forgot-password-reset.component';
import { AuthGuard } from './services/auth.guard';
import { ViewAllJobsComponent } from './dashboard/view-all-jobs/view-all-jobs.component';
import { PostJobComponent } from './dashboard/post-job/post-job.component';
import { InterviewSetupComponent } from './dashboard/interview-setup/interview-setup.component';
import { CreateAssessmentComponent } from './dashboard/interview-setup/create-assessment/create-assessment.component';
import { AssessmentCreationComponent } from './dashboard/interview-setup/assessment-creation/assessment-creation.component';
import { PreviewAssessmentComponent } from './dashboard/interview-setup/preview-assessment/preview-assessment.component';
import { ManageCandidatesComponent } from './dashboard/manage-candidates/manage-candidates.component';

const routes: Routes = [
  { 
    path: '', 
    component: SplashScreenComponent,
  },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { title: 'Dashboard' }
  },
  { 
    path: 'dashboard/view-all-jobs', 
    component: ViewAllJobsComponent,
    canActivate: [AuthGuard],
    data: { title: 'View All Jobs' }
  },
  { 
    path: 'dashboard/post-job', 
    component: PostJobComponent,
    canActivate: [AuthGuard],
    data: { title: 'Post a Job' }
  },
  { 
    path: 'dashboard/interview-setup', 
    component: InterviewSetupComponent,
    canActivate: [AuthGuard],
    data: { title: 'Interview Set-up' }
  },
  { 
    path: 'dashboard/interview-setup/create-assessment', 
    component: CreateAssessmentComponent,
    canActivate: [AuthGuard],
    data: { title: 'Create Assessment' }
  },
  { 
    path: 'dashboard/manage-candidates/:jobId', 
    component: ManageCandidatesComponent,
    canActivate: [AuthGuard],
    data: { title: 'Manage Candidates' }
  },
  { 
    path: 'dashboard/interview-setup/assessment-creation', 
    component: AssessmentCreationComponent,
    canActivate: [AuthGuard],
    data: { title: 'Assessment Creation' }
  },
  { 
    path: 'dashboard/interview-setup/preview-assessment', 
    component: PreviewAssessmentComponent,
    canActivate: [AuthGuard],
    data: { title: 'Preview Assessment' }
  },
  { 
    path: 'sign-up', 
    component: SignUpComponent,
  },
  { 
    path: 'login', 
    component: LoginComponent,
  },
  {
    path: 'forgot-password',
    children: [
      { 
        path: '', 
        redirectTo: 'email', 
        pathMatch: 'full',
      },
      { 
        path: 'email', 
        component: ForgotPasswordComponent,
      },
      { 
        path: 'success', 
        component: ForgotPasswordSuccessComponent,
      },
      { 
        path: 'verify', 
        component: ForgotPasswordVerifyComponent,
      },
      { 
        path: 'reset', 
        component: ForgotPasswordResetComponent,
      },
    ]
  },
  {
    path: 'company-profile',
    component: CompanyProfileComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: '**', 
    redirectTo: '',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
