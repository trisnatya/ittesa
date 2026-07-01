import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-indigo-800">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title class="login-title">
            <h1 class="text-3xl font-bold text-gray-800">ITESSA</h1>
          </mat-card-title>
          <mat-card-subtitle class="login-subtitle">IT Employee Self Service Application</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <div *ngIf="error" class="error-message mb-4">
            <mat-icon>error</mat-icon>
            <span>{{ error }}</span>
          </div>

          <form (ngSubmit)="onSubmit()" class="login-form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email Address</mat-label>
              <input matInput type="email" [(ngModel)]="email" name="email" placeholder="Enter your email" required>
              <mat-icon matPrefix>email</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput [type]="showPassword ? 'text' : 'password'" [(ngModel)]="password" name="password" placeholder="Enter your password" required>
              <mat-icon matPrefix>lock</mat-icon>
              <button mat-icon-button matSuffix type="button" (click)="showPassword = !showPassword">
                <mat-icon>{{ showPassword ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" [disabled]="loading" class="login-button">
              <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
              <span *ngIf="!loading">{{ 'Sign In' }}</span>
            </button>
          </form>
        </mat-card-content>
        
        <mat-card-actions class="login-actions">
          <span class="text-sm text-gray-500">
            Don't have an account?
            <a mat-button color="primary" routerLink="/register">Register here</a>
          </span>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-card {
      width: 100%;
      max-width: 420px;
      padding: 2rem;
      border-radius: 16px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }
    .login-title {
      text-align: center;
      margin-bottom: 0.5rem;
    }
    .login-title h1 {
      font-size: 2rem;
      margin: 0;
    }
    .login-subtitle {
      text-align: center;
      color: #6b7280;
    }
    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 1.5rem;
    }
    .full-width {
      width: 100%;
    }
    .login-button {
      height: 48px;
      font-size: 1rem;
      margin-top: 0.5rem;
    }
    .login-actions {
      display: flex;
      justify-content: center;
      padding: 1rem 0 0;
      border-top: none;
    }
    .error-message {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem;
      background-color: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 8px;
      color: #dc2626;
      font-size: 0.875rem;
    }
    .error-message mat-icon {
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  showPassword = false;
  error = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.error = 'Please fill in all fields';
      return;
    }

    this.error = '';
    this.loading = true;

    console.log('Login - Attempting login for:', this.email);
    
    this.authService.login(this.email, this.password).subscribe({
      next: (response: any) => {
        console.log('Login - Success! Response:', response);
        console.log('Login - Token stored:', !!localStorage.getItem('token'));
        console.log('Login - User stored:', !!localStorage.getItem('user'));
        
        this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Login - Error:', err);
        this.error = err.error?.message || 'Invalid email or password';
        this.loading = false;
      }
    });
  }
}
