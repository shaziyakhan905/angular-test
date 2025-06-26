import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (!token) {
    router.navigate(['/auth/login']);
    return false;
  }
  return true;
};
