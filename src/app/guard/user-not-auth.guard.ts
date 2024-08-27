import { CanActivateFn, Router } from '@angular/router';
import { UserServiceService } from '../services/user.service';
import { inject } from '@angular/core';


export const userFalseAuth: CanActivateFn = (route, state) => {
  const backendService = inject(UserServiceService);
  const router = inject(Router)
  if(backendService.isLoggedIn()){
    router.navigate(['/']); 
    return false;
  }else{
     return true
  }
};