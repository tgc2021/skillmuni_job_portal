import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SplashScreenComponent } from './auth/splash-screen/splash-screen.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ForgotPasswordEmailSentComponent } from './auth/forgot-password/forgot-password-email-sent/forgot-password-email-sent.component';
import { CompanyProfileComponent } from './company-profile/company-profile.component';
import { ForgotPasswordCreateComponent } from './auth/forgot-password/forgot-password-create/forgot-password-create.component';
import { ForgotPasswordSuccessComponent } from './auth/forgot-password/forgot-password-success/forgot-password-success.component';
import { DashboardComponent } from './dashboard/dashboard.component';


const routes: Routes = [
  { 
    path: '', 
    component: SplashScreenComponent,
  },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    data: { title: 'Dashboard' }
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
        path: 'email-sent', 
        component: ForgotPasswordEmailSentComponent,
      },
      { 
        path: 'create-password', 
        component: ForgotPasswordCreateComponent,

      },
      { 
        path: 'success', 
        component: ForgotPasswordSuccessComponent,

      }
    ]
  },
  {
    path: 'company-profile',
    component: CompanyProfileComponent
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
