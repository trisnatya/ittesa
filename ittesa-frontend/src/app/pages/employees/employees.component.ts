import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Employee } from '../../models';
import { environment } from '../../../environments/environment';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-employees',
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
    MatTabsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">Employee Management</h1>
        <div class="header-actions">
          <button mat-raised-button color="basic" (click)="exportData()" class="export-btn">
            <mat-icon>download</mat-icon>
            Export
          </button>
          <button mat-raised-button color="primary" (click)="openAddDialog()">
            <mat-icon>add</mat-icon>
            Add Employee
          </button>
        </div>
      </div>

      <!-- Status Tabs -->
      <mat-tab-group [(selectedIndex)]="selectedTabIndex" (selectedTabChange)="onTabChange($event)" class="status-tabs">
        <mat-tab *ngFor="let tab of statusTabs">
          <ng-template mat-tab-label>
            <span class="tab-label">{{ tab.label }}</span>
            <span class="tab-count">{{ getCountByStatus(tab.value) }}</span>
          </ng-template>
        </mat-tab>
      </mat-tab-group>

      <!-- Search and Table Card -->
      <mat-card class="table-card">
        <mat-card-content>
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Search by NIK or Name</mat-label>
            <mat-icon matPrefix>search</mat-icon>
            <input matInput [(ngModel)]="searchTerm" (ngModelChange)="applyFilter()" placeholder="Search by NIK or Name...">
            <button *ngIf="searchTerm" matSuffix mat-icon-button (click)="clearSearch()">
              <mat-icon>close</mat-icon>
            </button>
          </mat-form-field>

          <div class="table-container">
            <table mat-table [dataSource]="dataSource" matSort class="employees-table">
              <!-- NIK Column -->
              <ng-container matColumnDef="nik">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>NIK</th>
                <td mat-cell *matCellDef="let employee">{{ employee.nik }}</td>
              </ng-container>

              <!-- Full Name Column -->
              <ng-container matColumnDef="fullName">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Full Name</th>
                <td mat-cell *matCellDef="let employee">{{ employee.fullName }}</td>
              </ng-container>

              <!-- Directorate Column -->
              <ng-container matColumnDef="directorate">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Directorate</th>
                <td mat-cell *matCellDef="let employee">{{ employee.directorate }}</td>
              </ng-container>

              <!-- Unit Column -->
              <ng-container matColumnDef="unit">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Unit</th>
                <td mat-cell *matCellDef="let employee">{{ employee.unit }}</td>
              </ng-container>

              <!-- Status Column -->
              <ng-container matColumnDef="milestoneStatus">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Status</th>
                <td mat-cell *matCellDef="let employee">
                  <span class="status-badge" [ngClass]="getStatusClass(employee.milestoneStatus)">
                    {{ employee.milestoneStatus | titlecase }}
                  </span>
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let employee">
                  <button mat-icon-button matTooltip="View Details" (click)="viewDetail(employee)">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button mat-icon-button matTooltip="Edit" (click)="editEmployee(employee)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button matTooltip="Delete" color="warn" (click)="deleteEmployee(employee)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

              <!-- No Data Row -->
              <tr class="mat-row" *matNoDataRow>
                <td class="mat-cell no-data-cell" [attr.colspan]="displayedColumns.length">
                  No employees found
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
    .header-actions {
      display: flex;
      gap: 0.75rem;
    }
    .export-btn {
      border: 1px solid #d1d5db;
    }
    .status-tabs {
      margin-bottom: 1.5rem;
    }
    .tab-label {
      margin-right: 0.5rem;
    }
    .tab-count {
      background-color: #e5e7eb;
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 0.75rem;
    }
    .table-card {
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    .search-field {
      width: 100%;
      max-width: 400px;
      margin-bottom: 1rem;
    }
    .table-container {
      overflow-x: auto;
    }
    .employees-table {
      width: 100%;
    }
    .status-badge {
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 0.75rem;
      font-weight: 500;
    }
    .status-badge.draft {
      background-color: #f3f4f6;
      color: #6b7280;
    }
    .status-badge.submitted {
      background-color: #dbeafe;
      color: #2563eb;
    }
    .status-badge.done {
      background-color: #d1fae5;
      color: #16a34a;
    }
    .status-badge.rejected {
      background-color: #fee2e2;
      color: #dc2626;
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
      .header-actions {
        width: 100%;
      }
      .header-actions button {
        flex: 1;
      }
    }
  `]
})
export class EmployeesComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  employees: Employee[] = [];
  dataSource = new MatTableDataSource<Employee>();
  displayedColumns = ['nik', 'fullName', 'directorate', 'unit', 'milestoneStatus', 'actions'];
  searchTerm = '';
  selectedStatus = 'all';
  selectedTabIndex = 0;
  loading = false;

  statusTabs = [
    { label: 'All', value: 'all' },
    { label: 'Draft', value: 'draft' },
    { label: 'Submitted', value: 'submitted' },
    { label: 'Done', value: 'done' },
    { label: 'Rejected', value: 'rejected' }
  ];

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadEmployees(): void {
    this.loading = true;
    this.apiService.get<Employee[]>('/employees').subscribe({
      next: (data) => {
        this.employees = data;
        this.dataSource.data = this.filterEmployees();
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load employees:', err);
        this.employees = [
          { id: '1', nik: 'EMP001', fullName: 'John Doe', directorate: 'IT', unit: 'Development', milestoneStatus: 'draft' },
          { id: '2', nik: 'EMP002', fullName: 'Jane Smith', directorate: 'HR', unit: 'Recruitment', milestoneStatus: 'submitted' },
          { id: '3', nik: 'EMP003', fullName: 'Bob Wilson', directorate: 'Finance', unit: 'Accounting', milestoneStatus: 'done' },
          { id: '4', nik: 'EMP004', fullName: 'Alice Brown', directorate: 'IT', unit: 'Support', milestoneStatus: 'rejected' },
        ];
        this.dataSource.data = this.filterEmployees();
        this.loading = false;
      }
    });
  }

  filterEmployees(): Employee[] {
    let result = this.employees;
    
    if (this.selectedStatus !== 'all') {
      result = result.filter(e => e.milestoneStatus === this.selectedStatus);
    }
    
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(e => 
        e.nik.toLowerCase().includes(term) || 
        e.fullName.toLowerCase().includes(term)
      );
    }
    
    return result;
  }

  applyFilter(): void {
    this.dataSource.data = this.filterEmployees();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilter();
  }

  onTabChange(event: any): void {
    this.selectedTabIndex = event.index;
    this.selectedStatus = this.statusTabs[event.index].value;
    this.applyFilter();
  }

  getCountByStatus(status: string): number {
    if (status === 'all') return this.employees.length;
    return this.employees.filter(e => e.milestoneStatus === status).length;
  }

  getStatusClass(status: string): string {
    return status || 'draft';
  }

  openAddDialog(): void {
    // TODO: Implement add dialog
    this.snackBar.open('Add employee dialog - to be implemented', 'Close', { duration: 3000 });
  }

  viewDetail(employee: Employee): void {
    // TODO: Implement view detail dialog
    this.snackBar.open(`Viewing: ${employee.fullName}`, 'Close', { duration: 2000 });
  }

  editEmployee(employee: Employee): void {
    // TODO: Implement edit dialog
    this.snackBar.open(`Editing: ${employee.fullName}`, 'Close', { duration: 2000 });
  }

  deleteEmployee(employee: Employee): void {
    if (confirm(`Are you sure you want to delete ${employee.fullName}?`)) {
      this.apiService.delete(`/employees/${employee.id}`).subscribe({
        next: () => {
          this.snackBar.open('Employee deleted successfully', 'Close', { duration: 3000 });
          this.loadEmployees();
        },
        error: (err) => {
          console.error('Failed to delete employee:', err);
          this.snackBar.open('Failed to delete employee', 'Close', { duration: 3000 });
        }
      });
    }
  }

  exportData(): void {
    window.open(`${environment.apiUrl}/employees/export`, '_blank');
  }
}
