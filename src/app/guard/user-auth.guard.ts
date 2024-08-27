import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserServiceService } from '../services/user.service';

export const userAuthGuard: CanActivateFn = (route, state) => {
  const backendService = inject(UserServiceService);
  const router = inject(Router);

  if (backendService.isLoggedIn()) {
    return true;
  } else {
    router.navigate(['/login'])
    return false;
  }
};