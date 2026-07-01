import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { UserLog } from '../../models';
import { environment } from '../../../environments/environment';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-user-log',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">User Activity Logs</h1>
        <button mat-raised-button color="basic" (click)="exportLogs()" class="export-btn">
          <mat-icon>download</mat-icon>
          Export
        </button>
      </div>

      <!-- Filters -->
      <mat-card class="filters-card">
        <mat-card-content>
          <div class="filters-grid">
            <mat-form-field appearance="outline" class="filter-field">
              <mat-label>Filter by User ID</mat-label>
              <input matInput [(ngModel)]="filters.userId" placeholder="User ID">
            </mat-form-field>
            <mat-form-field appearance="outline" class="filter-field">
              <mat-label>Filter by Action</mat-label>
              <input matInput [(ngModel)]="filters.action" placeholder="Action">
            </mat-form-field>
            <mat-form-field appearance="outline" class="filter-field">
              <mat-label>Filter by Module</mat-label>
              <input matInput [(ngModel)]="filters.module" placeholder="Module">
            </mat-form-field>
            <mat-form-field appearance="outline" class="filter-field">
              <mat-label>Start Date</mat-label>
              <input matInput [(ngModel)]="filters.startDate" type="date">
            </mat-form-field>
            <mat-form-field appearance="outline" class="filter-field">
              <mat-label>End Date</mat-label>
              <input matInput [(ngModel)]="filters.endDate" type="date">
            </mat-form-field>
          </div>
          <div class="filter-actions">
            <button mat-raised-button color="primary" (click)="applyFilters()">
              <mat-icon>filter_list</mat-icon>
              Apply Filters
            </button>
            <button mat-stroked-button (click)="clearFilters()">
              <mat-icon>clear</mat-icon>
              Clear
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Logs Table -->
      <mat-card class="table-card">
        <mat-card-content>
          <div class="table-container">
            <table mat-table [dataSource]="dataSource" matSort class="logs-table">
              <!-- Timestamp Column -->
              <ng-container matColumnDef="createdAt">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Timestamp</th>
                <td mat-cell *matCellDef="let log">{{ log.createdAt | date:'medium' }}</td>
              </ng-container>

              <!-- User Column -->
              <ng-container matColumnDef="user">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>User</th>
                <td mat-cell *matCellDef="let log">{{ log.user?.fullName || log.userId }}</td>
              </ng-container>

              <!-- Action Column -->
              <ng-container matColumnDef="action">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Action</th>
                <td mat-cell *matCellDef="let log">
                  <span class="action-badge" [ngClass]="getActionClass(log.action)">
                    {{ log.action }}
                  </span>
                </td>
              </ng-container>

              <!-- Module Column -->
              <ng-container matColumnDef="module">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Module</th>
                <td mat-cell *matCellDef="let log">{{ log.module }}</td>
              </ng-container>

              <!-- Details Column -->
              <ng-container matColumnDef="details">
                <th mat-header-cell *matHeaderCellDef>Details</th>
                <td mat-cell *matCellDef="let log" class="details-cell" [matTooltip]="log.details | json">
                  {{ log.details | json | slice:0:30 }}...
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

              <!-- No Data Row -->
              <tr class="mat-row" *matNoDataRow>
                <td class="mat-cell no-data-cell" [attr.colspan]="displayedColumns.length">
                  No logs found
                </td>
              </tr>
            </table>

            <mat-paginator [pageSizeOptions]="[10, 25, 50, 100]" showFirstLastButtons></mat-paginator>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 1.5rem;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .page-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
    }
    .export-btn {
      border: 1px solid #d1d5db;
    }
    .filters-card {
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      margin-bottom: 1.5rem;
    }
    .filters-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
    }
    .filter-field {
      width: 100%;
    }
    .filter-actions {
      display: flex;
      gap: 0.75rem;
      margin-top: 1rem;
    }
    .table-card {
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    .table-container {
      overflow-x: auto;
    }
    .logs-table {
      width: 100%;
    }
    .action-badge {
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 0.75rem;
      font-weight: 500;
    }
    .action-badge.create {
      background-color: #d1fae5;
      color: #16a34a;
    }
    .action-badge.update {
      background-color: #dbeafe;
      color: #2563eb;
    }
    .action-badge.delete {
      background-color: #fee2e2;
      color: #dc2626;
    }
    .action-badge.login {
      background-color: #fef3c7;
      color: #d97706;
    }
    .action-badge.default {
      background-color: #f3f4f6;
      color: #6b7280;
    }
    .details-cell {
      max-width: 200px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;
    }
    .no-data-cell {
      text-align: center;
      padding: 3rem;
      color: #9ca3af;
    }
    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: flex-start;
      }
      .filters-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class UserLogComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  logs: UserLog[] = [];
  dataSource = new MatTableDataSource<UserLog>();
  displayedColumns = ['createdAt', 'user', 'action', 'module', 'details'];
  filters = {
    userId: '',
    action: '',
    module: '',
    startDate: '',
    endDate: ''
  };
  loading = false;

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadLogs();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadLogs(): void {
    this.loading = true;
    const params: any = {};
    if (this.filters.userId) params.userId = this.filters.userId;
    if (this.filters.action) params.action = this.filters.action;
    if (this.filters.module) params.module = this.filters.module;
    if (this.filters.startDate) params.startDate = this.filters.startDate;
    if (this.filters.endDate) params.endDate = this.filters.endDate;

    this.apiService.get<UserLog[]>('/user-logs', params).subscribe({
      next: (data) => {
        this.logs = data;
        this.dataSource.data = this.logs;
        this.loading = false;
      },
      error: () => {
        this.logs = [];
        this.dataSource.data = [];
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.loadLogs();
  }

  clearFilters(): void {
    this.filters = { userId: '', action: '', module: '', startDate: '', endDate: '' };
    this.applyFilters();
  }

  getActionClass(action: string): string {
    const actionLower = action?.toLowerCase() || '';
    if (actionLower.includes('create') || actionLower.includes('add')) return 'create';
    if (actionLower.includes('update') || actionLower.includes('edit')) return 'update';
    if (actionLower.includes('delete') || actionLower.includes('remove')) return 'delete';
    if (actionLower.includes('login')) return 'login';
    return 'default';
  }

  exportLogs(): void {
    window.open(`${environment.apiUrl}/user-logs/export`, '_blank');
  }
}
