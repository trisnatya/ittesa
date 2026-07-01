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
  selector: 'app-register',
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
      <mat-card class="register-card">
        <mat-card-header>
          <mat-card-title class="register-title">
            <h1 class="text-3xl font-bold text-gray-800">Create Account</h1>
          </mat-card-title>
          <mat-card-subtitle class="register-subtitle">Register for ITESSA</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <button mat-button routerLink="/login" class="back-button">
            <mat-icon>arrow_back</mat-icon>
            Back to Login
          </button>

          <div *ngIf="error" class="error-message mb-4">
            <mat-icon>error</mat-icon>
            <span>{{ error }}</span>
          </div>

          <div *ngIf="success" class="success-message mb-4">
            <mat-icon>check_circle</mat-icon>
            <span>{{ success }}</span>
          </div>

          <form (ngSubmit)="onSubmit()" class="register-form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Full Name</mat-label>
              <input matInput type="text" [(ngModel)]="fullName" name="fullName" placeholder="Enter your full name" required>
              <mat-icon matPrefix>person</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email Address</mat-label>
              <input matInput type="email" [(ngModel)]="email" name="email" placeholder="Enter your email" required>
              <mat-icon matPrefix>email</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput [type]="showPassword ? 'text' : 'password'" [(ngModel)]="password" name="password" placeholder="Enter your password" required minlength="6">
              <mat-icon matPrefix>lock</mat-icon>
              <button mat-icon-button matSuffix type="button" (click)="showPassword = !showPassword">
                <mat-icon>{{ showPassword ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              <mat-hint>Minimum 6 characters</mat-hint>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Confirm Password</mat-label>
              <input matInput [type]="showPassword ? 'text' : 'password'" [(ngModel)]="confirmPassword" name="confirmPassword" placeholder="Confirm your password" required>
              <mat-icon matPrefix>lock</mat-icon>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" [disabled]="loading" class="register-button">
              <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
              <span *ngIf="!loading">Register</span>
            </button>
          </form>
        </mat-card-content>
        
        <mat-card-actions class="register-actions">
          <span class="text-sm text-gray-500">
            Already have an account?
            <a mat-button color="primary" routerLink="/login">Sign In</a>
          </span>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .register-card {
      width: 100%;
      max-width: 420px;
      padding: 2rem;
      border-radius: 16px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }
    .register-title {
      text-align: center;
      margin-bottom: 0.25rem;
    }
    .register-title h1 {
      font-size: 1.75rem;
      margin: 0;
    }
    .register-subtitle {
      text-align: center;
      color: #6b7280;
    }
    .back-button {
      margin-bottom: 1rem;
      color: #6b7280;
    }
    .back-button mat-icon {
      margin-right: 0.25rem;
    }
    .register-form {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-top: 1rem;
    }
    .full-width {
      width: 100%;
    }
    .register-button {
      height: 48px;
      font-size: 1rem;
      margin-top: 0.5rem;
    }
    .register-actions {
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
    .success-message {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem;
      background-color: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 8px;
      color: #16a34a;
      font-size: 0.875rem;
    }
    .success-message mat-icon {
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
    }
  `]
})
export class RegisterComponent {
  fullName = '';
  email = '';
  password = '';
  confirmPassword = '';
  showPassword = false;
  error = '';
  success = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  onSubmit(): void {
    this.error = '';
    this.success = '';

    if (!this.fullName || !this.email || !this.password || !this.confirmPassword) {
      this.error = 'Please fill in all fields';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'Password must be at least 6 characters';
      return;
    }

    this.loading = true;

    this.authService.register({
      email: this.email,
      password: this.password,
      fullName: this.fullName
    }).subscribe({
      next: () => {
        this.success = 'Registration successful! Please login.';
        this.snackBar.open(this.success, 'Close', { duration: 3000 });
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Registration failed. Please try again.';
        this.loading = false;
      }
    });
  }
}
