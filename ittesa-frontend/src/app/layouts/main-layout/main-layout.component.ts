import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div style="padding: 20px;">
      <h1>WELCOME TO ITESSA DASHBOARD</h1>
      <p>User: {{ userName }}</p>
      <p>Role: {{ userRole }}</p>
      <button (click)="logout()">Logout</button>
      
      <hr/>
      
      <h2>Navigation</h2>
      <ul>
        <li><a href="/dashboard/employees">Employees</a></li>
        <li><a href="/dashboard/requests">Requests</a></li>
        <li><a href="/dashboard/faqs">FAQs</a></li>
        <li><a href="/dashboard/questions">Questions</a></li>
      </ul>
      
      <hr/>
      
      <router-outlet></router-outlet>
    </div>
  `
})
export class MainLayoutComponent implements OnInit {
  userName = 'Loading...';
  userRole = 'Loading...';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

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
