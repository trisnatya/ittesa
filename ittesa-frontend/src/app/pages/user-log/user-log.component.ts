import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { UserLog } from '../../models';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-user-log',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-800">User Activity Logs</h1>
        <button (click)="exportLogs()" class="btn btn-secondary">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          Export
        </button>
      </div>

      <!-- Filters -->
      <div class="card">
        <div class="flex gap-4 flex-wrap">
          <input
            type="text"
            [(ngModel)]="filters.userId"
            placeholder="Filter by User ID"
            class="form-input w-48"
          />
          <input
            type="text"
            [(ngModel)]="filters.action"
            placeholder="Filter by Action"
            class="form-input w-48"
          />
          <input
            type="text"
            [(ngModel)]="filters.module"
            placeholder="Filter by Module"
            class="form-input w-48"
          />
          <input
            type="date"
            [(ngModel)]="filters.startDate"
            class="form-input w-40"
          />
          <input
            type="date"
            [(ngModel)]="filters.endDate"
            class="form-input w-40"
          />
          <button (click)="applyFilters()" class="btn btn-primary">Apply</button>
          <button (click)="clearFilters()" class="btn btn-secondary">Clear</button>
        </div>
      </div>

      <!-- Logs Table -->
      <div class="card">
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User</th>
                <th>Action</th>
                <th>Module</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let log of logs">
                <td>{{ log.createdAt | date:'medium' }}</td>
                <td>{{ log.user?.fullName || log.userId }}</td>
                <td>
                  <span [class]="getActionBadgeClass(log.action)">
                    {{ log.action }}
                  </span>
                </td>
                <td>{{ log.module }}</td>
                <td class="max-w-xs truncate">{{ log.details | json }}</td>
              </tr>
              <tr *ngIf="logs.length === 0">
                <td colspan="5" class="text-center py-8 text-gray-500">
                  No logs found
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
          <p class="text-sm text-gray-500">
            Showing {{ (currentPage - 1) * pageSize + 1 }} to {{ currentPage * pageSize }} of {{ totalLogs }} entries
          </p>
          <div class="flex gap-2">
            <button 
              (click)="prevPage()" 
              [disabled]="currentPage === 1"
              class="btn btn-sm btn-secondary">
              Previous
            </button>
            <button 
              (click)="nextPage()" 
              [disabled]="currentPage >= totalPages"
              class="btn btn-sm btn-secondary">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class UserLogComponent implements OnInit {
  logs: UserLog[] = [];
  filters = {
    userId: '',
    action: '',
    module: '',
    startDate: '',
    endDate: ''
  };
  currentPage = 1;
  pageSize = 20;
  totalLogs = 0;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadLogs();
  }

  get totalPages(): number {
    return Math.ceil(this.totalLogs / this.pageSize);
  }

  loadLogs(): void {
    const params: any = {};
    if (this.filters.userId) params.userId = this.filters.userId;
    if (this.filters.action) params.action = this.filters.action;
    if (this.filters.module) params.module = this.filters.module;
    if (this.filters.startDate) params.startDate = this.filters.startDate;
    if (this.filters.endDate) params.endDate = this.filters.endDate;
    params.page = this.currentPage.toString();
    params.limit = this.pageSize.toString();

    this.apiService.get<UserLog[]>('/user-logs', params).subscribe({
      next: (data) => {
        this.logs = data;
        this.totalLogs = data.length;
      },
      error: () => {
        this.logs = [];
        this.totalLogs = 0;
      }
    });
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadLogs();
  }

  clearFilters(): void {
    this.filters = { userId: '', action: '', module: '', startDate: '', endDate: '' };
    this.applyFilters();
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadLogs();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadLogs();
    }
  }

  getActionBadgeClass(action: string): string {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('create') || actionLower.includes('add')) return 'badge badge-success';
    if (actionLower.includes('update') || actionLower.includes('edit')) return 'badge badge-primary';
    if (actionLower.includes('delete') || actionLower.includes('remove')) return 'badge badge-danger';
    if (actionLower.includes('login')) return 'badge badge-warning';
    return 'badge badge-gray';
  }

  exportLogs(): void {
    window.open(`${environment.apiUrl}/user-logs/export`, '_blank');
  }
}
