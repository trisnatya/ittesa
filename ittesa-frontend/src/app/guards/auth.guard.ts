import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);
  
  // Check for token in localStorage
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  console.log('Auth Guard - Token exists:', !!token);
  console.log('Auth Guard - User exists:', !!userStr);
  
  if (token && userStr) {
    console.log('Auth Guard - Allowing access');
    return true;
  }

  console.log('Auth Guard - Redirecting to login');
  router.navigate(['/login']);
  return false;
};
