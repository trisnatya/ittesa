import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <div style="display: flex; height: 100vh;">
      <!-- Sidebar -->
      <div style="width: 250px; background: #1e3a5f; color: white; padding: 20px;">
        <h2 style="margin: 0 0 30px 0; text-align: center;">ITESSA</h2>
        
        <nav>
          <a routerLink="/dashboard" routerLinkActive="active" 
             style="display: block; padding: 12px; color: white; text-decoration: none; margin-bottom: 8px; border-radius: 4px;">
            Dashboard
          </a>
          <a routerLink="/dashboard/employees" routerLinkActive="active"
             style="display: block; padding: 12px; color: white; text-decoration: none; margin-bottom: 8px; border-radius: 4px;">
            Employee
          </a>
          <a routerLink="/dashboard/requests" routerLinkActive="active"
             style="display: block; padding: 12px; color: white; text-decoration: none; margin-bottom: 8px; border-radius: 4px;">
            View Request
          </a>
          <a routerLink="/dashboard/faqs" routerLinkActive="active"
             style="display: block; padding: 12px; color: white; text-decoration: none; margin-bottom: 8px; border-radius: 4px;">
            FAQ
          </a>
          <a routerLink="/dashboard/questions" routerLinkActive="active"
             style="display: block; padding: 12px; color: white; text-decoration: none; margin-bottom: 8px; border-radius: 4px;">
            Question
          </a>
          <hr style="border-color: #3d5a80; margin: 20px 0;">
          <a routerLink="/dashboard/management/users" routerLinkActive="active"
             style="display: block; padding: 12px; color: white; text-decoration: none; margin-bottom: 8px; border-radius: 4px;">
            User Management
          </a>
          <a routerLink="/dashboard/management/roles" routerLinkActive="active"
             style="display: block; padding: 12px; color: white; text-decoration: none; margin-bottom: 8px; border-radius: 4px;">
            User Role
          </a>
          <a routerLink="/dashboard/management/email-templates" routerLinkActive="active"
             style="display: block; padding: 12px; color: white; text-decoration: none; margin-bottom: 8px; border-radius: 4px;">
            Template Email
          </a>
          <a routerLink="/dashboard/management/user-logs" routerLinkActive="active"
             style="display: block; padding: 12px; color: white; text-decoration: none; margin-bottom: 8px; border-radius: 4px;">
            User Log
          </a>
          <hr style="border-color: #3d5a80; margin: 20px 0;">
          <button (click)="logout()" 
                  style="width: 100%; padding: 12px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Logout
          </button>
        </nav>
      </div>
      
      <!-- Main Content -->
      <div style="flex: 1; display: flex; flex-direction: column;">
        <!-- Header -->
        <div style="background: #f8f9fa; padding: 15px 25px; border-bottom: 1px solid #dee2e6; display: flex; justify-content: space-between; align-items: center;">
          <h3 style="margin: 0;">ITESSA Dashboard</h3>
          <div>
            <span>{{ getUserFullName() }}</span>
            <span style="margin-left: 15px; color: #6c757d;">{{ getUserRole() }}</span>
          </div>
        </div>
        
        <!-- Content Area -->
        <div style="flex: 1; padding: 25px; overflow: auto;">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [`
    a:hover {
      background: #3d5a80 !important;
    }
    a.active {
      background: #0d1f33 !important;
    }
  `]
})
export class MainLayoutComponent implements OnInit {
  currentUser: any = null;
  isAuthenticated = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check authentication manually
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        this.currentUser = JSON.parse(userStr);
        this.isAuthenticated = true;
      } catch (e) {
        this.isAuthenticated = false;
      }
    }
    
    if (!this.isAuthenticated) {
      this.router.navigate(['/login']);
      return;
    }
  }

  getUserFullName(): string {
    return this.currentUser?.fullName || 'User';
  }

  getUserEmail(): string {
    return this.currentUser?.email || '';
  }

  getUserRole(): string {
    return this.currentUser?.role?.name || 'User';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
