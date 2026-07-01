import { Component, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatDividerModule,
    MatBadgeModule
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <ng-container *ngIf="isHandset$ | async as isHandset">
        <mat-sidenav 
          #drawer 
          class="sidenav" 
          [mode]="isHandset ? 'over' : 'side'" 
          [opened]="!isHandset">
          
          <div class="sidenav-header">
            <h1 class="sidenav-logo">ITESSA</h1>
          </div>
          
          <mat-nav-list>
            <a mat-list-item routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" (click)="closeSidenavIfHandset()">
              <mat-icon matListItemIcon>dashboard</mat-icon>
              <span matListItemTitle>Dashboard</span>
            </a>
            <a mat-list-item routerLink="/employees" routerLinkActive="active" (click)="closeSidenavIfHandset()">
              <mat-icon matListItemIcon>people</mat-icon>
              <span matListItemTitle>Employee</span>
            </a>
            <a mat-list-item routerLink="/requests" routerLinkActive="active" (click)="closeSidenavIfHandset()">
              <mat-icon matListItemIcon>description</mat-icon>
              <span matListItemTitle>View Request</span>
            </a>
            
            <mat-divider></mat-divider>
            <div mat-subheader>Support</div>
            
            <a mat-list-item routerLink="/faqs" routerLinkActive="active" (click)="closeSidenavIfHandset()">
              <mat-icon matListItemIcon>help</mat-icon>
              <span matListItemTitle>FAQ</span>
            </a>
            <a mat-list-item routerLink="/questions" routerLinkActive="active" (click)="closeSidenavIfHandset()">
              <mat-icon matListItemIcon>question_answer</mat-icon>
              <span matListItemTitle>Question</span>
            </a>
            
            <mat-divider></mat-divider>
            <div mat-subheader>Management</div>
            
            <a mat-list-item routerLink="/management/users" routerLinkActive="active" (click)="closeSidenavIfHandset()">
              <mat-icon matListItemIcon>person</mat-icon>
              <span matListItemTitle>User Management</span>
            </a>
            <a mat-list-item routerLink="/management/roles" routerLinkActive="active" (click)="closeSidenavIfHandset()">
              <mat-icon matListItemIcon>admin_panel_settings</mat-icon>
              <span matListItemTitle>User Role</span>
            </a>
            <a mat-list-item routerLink="/management/email-templates" routerLinkActive="active" (click)="closeSidenavIfHandset()">
              <mat-icon matListItemIcon>email</mat-icon>
              <span matListItemTitle>Template Email</span>
            </a>
            <a mat-list-item routerLink="/management/user-logs" routerLinkActive="active" (click)="closeSidenavIfHandset()">
              <mat-icon matListItemIcon>history</mat-icon>
              <span matListItemTitle>User Log</span>
            </a>
            
            <mat-divider></mat-divider>
            
            <a mat-list-item (click)="logout()">
              <mat-icon matListItemIcon color="warn">logout</mat-icon>
              <span matListItemTitle>Logout</span>
            </a>
          </mat-nav-list>
        </mat-sidenav>
        
        <mat-sidenav-content>
          <mat-toolbar class="mat-elevation-z4">
            <button mat-icon-button *ngIf="isHandset" (click)="drawer.toggle()">
              <mat-icon>menu</mat-icon>
            </button>
            <span class="toolbar-title">ITESSA</span>
            <span class="spacer"></span>
            
            <button mat-icon-button [matMenuTriggerFor]="notificationMenu">
              <mat-icon [matBadge]="notificationCount" matBadgeColor="warn" [matBadgeHidden]="notificationCount === 0">notifications</mat-icon>
            </button>
            <mat-menu #notificationMenu="matMenu" class="notification-menu">
              <div class="notification-header">
                <span>Notifications</span>
              </div>
              <button mat-menu-item disabled>
                <mat-icon>info</mat-icon>
                <span>No new notifications</span>
              </button>
            </mat-menu>
            
            <button mat-button [matMenuTriggerFor]="userMenu" class="user-button">
              <mat-icon>account_circle</mat-icon>
              <span class="user-name">{{ getUserFullName() }}</span>
              <mat-icon>arrow_drop_down</mat-icon>
            </button>
            <mat-menu #userMenu="matMenu">
              <button mat-menu-item disabled>
                <mat-icon>person</mat-icon>
                <span>{{ getUserEmail() }}</span>
              </button>
              <button mat-menu-item disabled>
                <mat-icon>badge</mat-icon>
                <span>{{ getUserRole() }}</span>
              </button>
              <mat-divider></mat-divider>
              <button mat-menu-item (click)="logout()">
                <mat-icon color="warn">logout</mat-icon>
                <span>Logout</span>
              </button>
            </mat-menu>
          </mat-toolbar>
          
          <div class="main-content-container">
            <router-outlet></router-outlet>
          </div>
        </mat-sidenav-content>
      </ng-container>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100vh;
    }
    
    .sidenav {
      width: 280px;
      background: linear-gradient(180deg, #1e3a5f 0%, #0d1f33 100%);
      color: white;
    }
    
    .sidenav-header {
      padding: 20px 16px;
      background: rgba(255, 255, 255, 0.05);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .sidenav-logo {
      font-size: 24px;
      font-weight: 700;
      margin: 0;
      background: linear-gradient(135deg, #42a5f5 0%, #1976d2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .mat-mdc-nav-list {
      padding-top: 8px;
    }
    
    .mat-mdc-nav-list a {
      margin: 4px 8px;
      border-radius: 8px;
      height: 48px;
      color: rgba(255, 255, 255, 0.87);
      transition: all 0.3s ease;
    }
    
    .mat-mdc-nav-list a:hover {
      background: rgba(255, 255, 255, 0.1);
    }
    
    .mat-mdc-nav-list a.active {
      background: linear-gradient(135deg, #42a5f5 0%, #1976d2 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
    }
    
    .mat-mdc-nav-list a mat-icon {
      color: rgba(255, 255, 255, 0.7);
      margin-right: 12px;
    }
    
    .mat-mdc-nav-list a.active mat-icon {
      color: white;
    }
    
    [mat-subheader] {
      color: rgba(255, 255, 255, 0.5);
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      padding: 16px 16px 8px;
    }
    
    mat-divider {
      margin: 8px 16px;
      border-color: rgba(255, 255, 255, 0.1);
    }
    
    mat-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: white;
    }
    
    .toolbar-title {
      font-weight: 600;
      color: #1e3a5f;
    }
    
    .spacer {
      flex: 1 1 auto;
    }
    
    .user-button {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .user-name {
      max-width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .main-content-container {
      padding: 24px;
      background: #f5f7fa;
      min-height: calc(100vh - 64px);
    }
    
    .notification-header {
      padding: 12px 16px;
      font-weight: 600;
      border-bottom: 1px solid #e0e0e0;
    }
    
    @media (max-width: 600px) {
      .main-content-container {
        padding: 16px;
      }
      
      .user-name {
        display: none;
      }
    }
  `]
})
export class MainLayoutComponent implements OnInit {
  isHandset$: Observable<boolean>;
  currentUser: any = null;
  notificationCount = 0;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private router: Router
  ) {
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(
        map(result => result.matches)
      );
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
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

  closeSidenavIfHandset(): void {
    // Sidenav will auto-close on small screens via mode binding
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
