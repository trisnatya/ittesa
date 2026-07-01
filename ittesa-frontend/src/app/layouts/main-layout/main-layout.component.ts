import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  template: `
    <div class="flex">
      <app-sidebar></app-sidebar>
      <div class="main-content">
        <header class="header">
          <div>
            <h2 class="text-lg font-semibold text-gray-800">ITESSA Dashboard</h2>
          </div>
          <div class="flex items-center gap-4">
            <span class="text-sm text-gray-600">{{ currentUser?.fullName }}</span>
            <div class="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium">
              {{ getUserInitials() }}
            </div>
          </div>
        </header>
        <div class="p-6">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `
})
export class MainLayoutComponent {
  currentUser: any = null;

  constructor(private authService: AuthService) {
    this.currentUser = this.authService.getCurrentUser();
  }

  getUserInitials(): string {
    if (!this.currentUser?.fullName) return 'U';
    return this.currentUser.fullName
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
}
