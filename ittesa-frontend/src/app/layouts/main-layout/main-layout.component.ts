import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-container">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <h1 class="logo">ITESSA</h1>
          <p class="subtitle">IT Employee Self Service</p>
        </div>
        
        <nav class="sidebar-nav">
          <div class="nav-section">
            <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-item">
              <span class="nav-icon">📊</span>
              <span class="nav-text">Dashboard</span>
            </a>
            <a routerLink="/dashboard/employees" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">👥</span>
              <span class="nav-text">Employee</span>
            </a>
            <a routerLink="/dashboard/requests" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">📋</span>
              <span class="nav-text">View Request</span>
            </a>
          </div>
          
          <div class="nav-section">
            <p class="nav-section-title">Support</p>
            <a routerLink="/dashboard/faqs" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">❓</span>
              <span class="nav-text">FAQ</span>
            </a>
            <a routerLink="/dashboard/questions" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">💬</span>
              <span class="nav-text">Question</span>
            </a>
          </div>
          
          <div class="nav-section">
            <p class="nav-section-title">Management</p>
            <a routerLink="/dashboard/management/users" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">👤</span>
              <span class="nav-text">User Management</span>
            </a>
            <a routerLink="/dashboard/management/roles" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">🔐</span>
              <span class="nav-text">User Role</span>
            </a>
            <a routerLink="/dashboard/management/email-templates" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">📧</span>
              <span class="nav-text">Template Email</span>
            </a>
            <a routerLink="/dashboard/management/user-logs" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">📝</span>
              <span class="nav-text">User Log</span>
            </a>
          </div>
        </nav>
        
        <div class="sidebar-footer">
          <div class="user-info">
            <span class="user-name">{{ userName }}</span>
            <span class="user-role">{{ userRole }}</span>
          </div>
          <button (click)="logout()" class="logout-btn">Logout</button>
        </div>
      </aside>
      
      <!-- Main Content -->
      <main class="main-content">
        <header class="top-header">
          <h2>Welcome, {{ userName }}</h2>
          <div class="header-actions">
            <span class="current-date">{{ currentDate }}</span>
          </div>
        </header>
        
        <div class="content-area">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      height: 100vh;
      background-color: #f5f7fa;
    }
    
    /* Sidebar */
    .sidebar {
      width: 260px;
      background: linear-gradient(180deg, #1e3a5f 0%, #0d1f33 100%);
      color: white;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
    }
    
    .sidebar-header {
      padding: 24px 20px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    
    .logo {
      font-size: 24px;
      font-weight: 700;
      margin: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .subtitle {
      font-size: 11px;
      color: rgba(255,255,255,0.6);
      margin: 4px 0 0 0;
    }
    
    .sidebar-nav {
      flex: 1;
      padding: 16px 12px;
      overflow-y: auto;
    }
    
    .nav-section {
      margin-bottom: 24px;
    }
    
    .nav-section-title {
      font-size: 11px;
      font-weight: 600;
      color: rgba(255,255,255,0.4);
      text-transform: uppercase;
      letter-spacing: 1px;
      padding: 0 12px;
      margin: 0 0 8px 0;
    }
    
    .nav-item {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      color: rgba(255,255,255,0.8);
      text-decoration: none;
      border-radius: 8px;
      margin-bottom: 4px;
      transition: all 0.2s;
      font-size: 14px;
    }
    
    .nav-item:hover {
      background: rgba(255,255,255,0.1);
      color: white;
    }
    
    .nav-item.active {
      background: rgba(255,255,255,0.15);
      color: white;
      font-weight: 500;
    }
    
    .nav-icon {
      font-size: 18px;
      margin-right: 12px;
      width: 24px;
      text-align: center;
    }
    
    .nav-text {
      flex: 1;
    }
    
    .sidebar-footer {
      padding: 16px;
      border-top: 1px solid rgba(255,255,255,0.1);
    }
    
    .user-info {
      margin-bottom: 12px;
    }
    
    .user-name {
      display: block;
      font-size: 14px;
      font-weight: 500;
      color: white;
    }
    
    .user-role {
      display: block;
      font-size: 12px;
      color: rgba(255,255,255,0.6);
      margin-top: 2px;
    }
    
    .logout-btn {
      width: 100%;
      padding: 10px;
      background: rgba(220, 53, 69, 0.2);
      color: #ff6b7a;
      border: 1px solid rgba(220, 53, 69, 0.3);
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      transition: all 0.2s;
    }
    
    .logout-btn:hover {
      background: rgba(220, 53, 69, 0.3);
      color: #ff8a94;
    }
    
    /* Main Content */
    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    
    .top-header {
      background: white;
      padding: 16px 24px;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .top-header h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: #1f2937;
    }
    
    .header-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .current-date {
      font-size: 13px;
      color: #6b7280;
    }
    
    .content-area {
      flex: 1;
      padding: 24px;
      overflow-y: auto;
    }
  `]
})
export class MainLayoutComponent implements OnInit {
  userName = 'Loading...';
  userRole = 'Loading...';
  currentDate = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentDate = new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  ngOnInit() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.userName = user.fullName || 'Unknown';
        this.userRole = user.role?.name || 'Unknown';
      } catch (e) {
        console.error('Parse error:', e);
        this.router.navigate(['/login']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
