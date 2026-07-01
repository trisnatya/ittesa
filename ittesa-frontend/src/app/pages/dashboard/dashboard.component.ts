import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { DashboardStats } from '../../models';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="dashboard-container">
      <div class="page-header">
        <h1 class="page-title">Dashboard</h1>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <mat-card class="stat-card" [class.employees]="true">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-info">
                <p class="stat-label">Total Employees</p>
                <p class="stat-value">{{ stats.totalEmployees }}</p>
              </div>
              <div class="stat-icon-wrapper employees">
                <mat-icon>people</mat-icon>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card" [class.requests]="true">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-info">
                <p class="stat-label">Total Requests</p>
                <p class="stat-value">{{ stats.totalRequests }}</p>
              </div>
              <div class="stat-icon-wrapper requests">
                <mat-icon>description</mat-icon>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card" [class.pending]="true">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-info">
                <p class="stat-label">Pending Requests</p>
                <p class="stat-value">{{ stats.pendingRequests }}</p>
              </div>
              <div class="stat-icon-wrapper pending">
                <mat-icon>schedule</mat-icon>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card" [class.completed]="true">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-info">
                <p class="stat-label">Completed Requests</p>
                <p class="stat-value">{{ stats.completedRequests }}</p>
              </div>
              <div class="stat-icon-wrapper completed">
                <mat-icon>task_alt</mat-icon>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Charts -->
      <div class="charts-grid">
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Employee Status Overview</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="chart-placeholder">
              <mat-icon class="chart-icon">bar_chart</mat-icon>
              <p>Employee Chart Placeholder</p>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Requests by Type</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="chart-placeholder">
              <mat-icon class="chart-icon">pie_chart</mat-icon>
              <p>Request Chart Placeholder</p>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Recent Activity -->
      <mat-card class="activity-card">
        <mat-card-header>
          <mat-card-title>Recent Activity</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="activity-list">
            <div class="activity-item">
              <div class="activity-icon-wrapper create">
                <mat-icon>add</mat-icon>
              </div>
              <div class="activity-details">
                <p class="activity-title">New request submitted</p>
                <p class="activity-subtitle">DPLK Request - John Doe</p>
              </div>
              <span class="activity-time">2 hours ago</span>
            </div>
            <div class="activity-item">
              <div class="activity-icon-wrapper update">
                <mat-icon>person_add</mat-icon>
              </div>
              <div class="activity-details">
                <p class="activity-title">New employee registered</p>
                <p class="activity-subtitle">Jane Smith - IT Department</p>
              </div>
              <span class="activity-time">5 hours ago</span>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 1.5rem;
    }
    .page-header {
      margin-bottom: 1.5rem;
    }
    .page-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }
    .stat-card {
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .stat-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem;
    }
    .stat-info {
      flex: 1;
    }
    .stat-label {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0 0 0.25rem 0;
    }
    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0;
    }
    .stat-icon-wrapper {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .stat-icon-wrapper.employees {
      background-color: #dbeafe;
    }
    .stat-icon-wrapper.employees mat-icon {
      color: #2563eb;
    }
    .stat-icon-wrapper.requests {
      background-color: #fef3c7;
    }
    .stat-icon-wrapper.requests mat-icon {
      color: #d97706;
    }
    .stat-icon-wrapper.pending {
      background-color: #fed7aa;
    }
    .stat-icon-wrapper.pending mat-icon {
      color: #ea580c;
    }
    .stat-icon-wrapper.completed {
      background-color: #d1fae5;
    }
    .stat-icon-wrapper.completed mat-icon {
      color: #16a34a;
    }
    .stat-icon-wrapper mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }
    .charts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }
    .chart-card {
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    .chart-card mat-card-header {
      padding: 1rem 1rem 0;
    }
    .chart-card mat-card-title {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 0;
    }
    .chart-card mat-card-content {
      padding: 1rem;
    }
    .chart-placeholder {
      height: 200px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: #f9fafb;
      border-radius: 8px;
      color: #9ca3af;
    }
    .chart-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 0.5rem;
    }
    .activity-card {
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    .activity-card mat-card-header {
      padding: 1rem 1rem 0;
    }
    .activity-card mat-card-title {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 0;
    }
    .activity-card mat-card-content {
      padding: 1rem;
    }
    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .activity-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background-color: #f9fafb;
      border-radius: 8px;
    }
    .activity-icon-wrapper {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .activity-icon-wrapper.create {
      background-color: #d1fae5;
    }
    .activity-icon-wrapper.create mat-icon {
      color: #16a34a;
    }
    .activity-icon-wrapper.update {
      background-color: #dbeafe;
    }
    .activity-icon-wrapper.update mat-icon {
      color: #2563eb;
    }
    .activity-icon-wrapper mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
    .activity-details {
      flex: 1;
    }
    .activity-title {
      font-weight: 500;
      color: #1f2937;
      margin: 0 0 0.25rem 0;
    }
    .activity-subtitle {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
    }
    .activity-time {
      font-size: 0.875rem;
      color: #9ca3af;
    }
    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }
      .charts-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats = {
    totalEmployees: 0,
    totalRequests: 0,
    pendingRequests: 0,
    completedRequests: 0
  };
  loading = true;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.apiService.get<DashboardStats>('/dashboard/stats').subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load stats:', err);
        this.stats = {
          totalEmployees: 150,
          totalRequests: 320,
          pendingRequests: 45,
          completedRequests: 275
        };
        this.loading = false;
      }
    });
  }
}
