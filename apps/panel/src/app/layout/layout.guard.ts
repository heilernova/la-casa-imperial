import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../authentication/session.service';

export const layoutGuard: CanActivateFn = () => {
  const session = inject(SessionService);
  const router = inject(Router);
   
  return session.isLoggedIn ? true : router.createUrlTree(["/login"]);
};
