import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from './services/user.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private authService: UserService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAdmin()) {
      return true; // Autoriser l'accès
    } else {
      this.router.navigate(['/unauthorized']); // Rediriger vers une page non autorisée
      return false; // Bloquer l'accès
    }
  }
}
