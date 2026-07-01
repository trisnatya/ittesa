import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { User, Role } from '../../models';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-user-management',
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
    MatSelectModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">User Management</h1>
        <button mat-raised-button color="primary" (click)="openAddDialog()">
          <mat-icon>add</mat-icon>
          Add User
        </button>
      </div>

      <!-- User Table -->
      <mat-card class="table-card">
        <mat-card-content>
          <div class="table-container">
            <table mat-table [dataSource]="dataSource" matSort class="users-table">
              <!-- Full Name Column -->
              <ng-container matColumnDef="fullName">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Full Name</th>
                <td mat-cell *matCellDef="let user">{{ user.fullName }}</td>
              </ng-container>

              <!-- Email Column -->
              <ng-container matColumnDef="email">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Email</th>
                <td mat-cell *matCellDef="let user">{{ user.email }}</td>
              </ng-container>

              <!-- Role Column -->
              <ng-container matColumnDef="role">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Role</th>
                <td mat-cell *matCellDef="let user">{{ user.role?.name || '-' }}</td>
              </ng-container>

              <!-- Status Column -->
              <ng-container matColumnDef="isActive">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Status</th>
                <td mat-cell *matCellDef="let user">
                  <span class="status-badge" [class.active]="user.isActive" [class.inactive]="!user.isActive">
                    {{ user.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
              </ng-container>

              <!-- Created Column -->
              <ng-container matColumnDef="createdAt">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Created</th>
                <td mat-cell *matCellDef="let user">{{ user.createdAt | date:'short' }}</td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let user">
                  <button mat-icon-button matTooltip="Edit" (click)="editUser(user)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button matTooltip="{{ user.isActive ? 'Deactivate' : 'Activate' }}" (click)="toggleStatus(user)">
                    <mat-icon>{{ user.isActive ? 'block' : 'check_circle' }}</mat-icon>
                  </button>
                  <button mat-icon-button matTooltip="Delete" color="warn" (click)="deleteUser(user)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

              <!-- No Data Row -->
              <tr class="mat-row" *matNoDataRow>
                <td class="mat-cell no-data-cell" [attr.colspan]="displayedColumns.length">
                  No users found
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
    .table-card {
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    .table-container {
      overflow-x: auto;
    }
    .users-table {
      width: 100%;
    }
    .status-badge {
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 0.75rem;
      font-weight: 500;
    }
    .status-badge.active {
      background-color: #d1fae5;
      color: #16a34a;
    }
    .status-badge.inactive {
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
    }
  `]
})
export class UserManagementComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  users: User[] = [];
  roles: Role[] = [];
  dataSource = new MatTableDataSource<User>();
  displayedColumns = ['fullName', 'email', 'role', 'isActive', 'createdAt', 'actions'];
  showModal = false;
  isEdit = false;
  loading = false;
  formData: any = { fullName: '', email: '', password: '', roleId: '', isActive: true };

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadUsers(): void {
    this.loading = true;
    this.apiService.get<User[]>('/users').subscribe({
      next: (data) => {
        this.users = data;
        this.dataSource.data = this.users;
        this.loading = false;
      },
      error: () => {
        this.users = [];
        this.dataSource.data = [];
        this.loading = false;
      }
    });
  }

  loadRoles(): void {
    this.apiService.get<Role[]>('/roles').subscribe({
      next: (data) => this.roles = data,
      error: () => this.roles = []
    });
  }

  openAddDialog(): void {
    this.isEdit = false;
    this.formData = { fullName: '', email: '', password: '', roleId: '', isActive: true };
    this.snackBar.open('Add user dialog - to be implemented', 'Close', { duration: 3000 });
  }

  closeModal(): void {
    this.showModal = false;
  }

  editUser(user: User): void {
    this.isEdit = true;
    this.formData = { ...user, password: '', roleId: user.roleId || '' };
    this.snackBar.open(`Editing user: ${user.fullName}`, 'Close', { duration: 2000 });
  }

  saveUser(): void {
    const action = this.isEdit
      ? this.apiService.put(`/users/${this.formData.id}`, this.formData)
      : this.apiService.post('/users', this.formData);

    action.subscribe({
      next: () => {
        this.snackBar.open('User saved successfully', 'Close', { duration: 3000 });
        this.closeModal();
        this.loadUsers();
      },
      error: (err) => {
        console.error('Failed to save user:', err);
        this.snackBar.open('Failed to save user', 'Close', { duration: 3000 });
      }
    });
  }

  toggleStatus(user: User): void {
    this.apiService.patch(`/users/${user.id}`, { isActive: !user.isActive }).subscribe({
      next: () => {
        this.snackBar.open(`User ${user.isActive ? 'deactivated' : 'activated'} successfully`, 'Close', { duration: 3000 });
        this.loadUsers();
      },
      error: (err) => {
        console.error('Failed to toggle status:', err);
        this.snackBar.open('Failed to toggle user status', 'Close', { duration: 3000 });
      }
    });
  }

  deleteUser(user: User): void {
    if (!confirm(`Delete user ${user.fullName}?`)) return;
    this.apiService.delete(`/users/${user.id}`).subscribe({
      next: () => {
        this.snackBar.open('User deleted successfully', 'Close', { duration: 3000 });
        this.loadUsers();
      },
      error: (err) => {
        console.error('Failed to delete user:', err);
        this.snackBar.open('Failed to delete user', 'Close', { duration: 3000 });
      }
    });
  }
}
