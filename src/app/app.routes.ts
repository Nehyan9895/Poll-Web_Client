import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { HomeComponent } from './components/home/home.component';
import { PollPageComponent } from './components/poll-page/poll-page.component';
import { userAuthGuard } from './guard/user-auth.guard';
import { userFalseAuth } from './guard/user-not-auth.guard';
import { MyPollsComponent } from './components/my-polls/my-polls.component';

export const routes: Routes = [
    {
        path:'login',
        component:LoginComponent,
        canActivate:[userFalseAuth]
    },
    {
        path:'signup',
        component:SignupComponent,
        canActivate:[userFalseAuth]
    },
    {
        path:'',
        component:HomeComponent,
        canActivate:[userAuthGuard]
    },
    {
        path:'home',
        component:HomeComponent,
        canActivate:[userAuthGuard]
    },
    {
        path:'poll/:id',
        component:PollPageComponent,
        canActivate:[userAuthGuard]
    },
    {
        path:'myPolls',
        component:MyPollsComponent,
        canActivate:[userAuthGuard]
    }
];
