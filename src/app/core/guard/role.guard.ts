import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  
  const authService = inject(AuthService);
  const router = inject(Router);

  const userRole = authService.getRoleFromToken();

  // Admin can access everything
  if (userRole === 'admin') {
    return true;
  }

  router.navigate(['/']);
  return false;
};
