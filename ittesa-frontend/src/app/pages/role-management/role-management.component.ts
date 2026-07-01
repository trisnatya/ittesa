import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Role } from '../../models';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-role-management',
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
    MatCheckboxModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">User Role Management</h1>
        <button mat-raised-button color="primary" (click)="openAddDialog()">
          <mat-icon>add</mat-icon>
          Add Role
        </button>
      </div>

      <!-- Role Table -->
      <mat-card class="table-card">
        <mat-card-content>
          <div class="table-container">
            <table mat-table [dataSource]="dataSource" matSort class="roles-table">
              <!-- Role Name Column -->
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Role Name</th>
                <td mat-cell *matCellDef="let role">{{ role.name }}</td>
              </ng-container>

              <!-- Permissions Column -->
              <ng-container matColumnDef="permissions">
                <th mat-header-cell *matHeaderCellDef>Permissions</th>
                <td mat-cell *matCellDef="let role">
                  <div class="permissions-list">
                    <span *ngFor="let perm of getPermissions(role)" class="permission-chip">
                      {{ perm }}
                    </span>
                  </div>
                </td>
              </ng-container>

              <!-- Created Column -->
              <ng-container matColumnDef="createdAt">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Created</th>
                <td mat-cell *matCellDef="let role">{{ role.createdAt | date:'short' }}</td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let role">
                  <button mat-icon-button matTooltip="Edit" (click)="editRole(role)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button matTooltip="Delete" color="warn" (click)="deleteRole(role)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

              <!-- No Data Row -->
              <tr class="mat-row" *matNoDataRow>
                <td class="mat-cell no-data-cell" [attr.colspan]="displayedColumns.length">
                  No roles found
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
    .roles-table {
      width: 100%;
    }
    .permissions-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem;
    }
    .permission-chip {
      background-color: #e5e7eb;
      color: #4b5563;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 0.75rem;
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
export class RoleManagementComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  roles: Role[] = [];
  dataSource = new MatTableDataSource<Role>();
  displayedColumns = ['name', 'permissions', 'createdAt', 'actions'];
  showModal = false;
  isEdit = false;
  loading = false;
  availablePermissions = ['dashboard', 'employees', 'requests', 'faqs', 'questions', 'users', 'roles', 'email-templates', 'user-logs'];
  formData: any = { name: '', permissions: [] as string[] };

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadRoles(): void {
    this.loading = true;
    this.apiService.get<Role[]>('/roles').subscribe({
      next: (data) => {
        this.roles = data;
        this.dataSource.data = this.roles;
        this.loading = false;
      },
      error: () => {
        this.roles = [];
        this.dataSource.data = [];
        this.loading = false;
      }
    });
  }

  getPermissions(role: Role): string[] {
    return role.permissions || [];
  }

  hasPermission(perm: string): boolean {
    return this.formData.permissions.includes(perm);
  }

  togglePermission(perm: string): void {
    const idx = this.formData.permissions.indexOf(perm);
    if (idx >= 0) {
      this.formData.permissions.splice(idx, 1);
    } else {
      this.formData.permissions.push(perm);
    }
  }

  openAddDialog(): void {
    this.isEdit = false;
    this.formData = { name: '', permissions: [] };
    this.snackBar.open('Add role dialog - to be implemented', 'Close', { duration: 3000 });
  }

  closeModal(): void {
    this.showModal = false;
  }

  editRole(role: Role): void {
    this.isEdit = true;
    this.formData = { ...role, permissions: [...(role.permissions || [])] };
    this.snackBar.open(`Editing role: ${role.name}`, 'Close', { duration: 2000 });
  }

  saveRole(): void {
    const action = this.isEdit
      ? this.apiService.put(`/roles/${this.formData.id}`, this.formData)
      : this.apiService.post('/roles', this.formData);

    action.subscribe({
      next: () => {
        this.snackBar.open('Role saved successfully', 'Close', { duration: 3000 });
        this.closeModal();
        this.loadRoles();
      },
      error: (err) => {
        console.error('Failed to save role:', err);
        this.snackBar.open('Failed to save role', 'Close', { duration: 3000 });
      }
    });
  }

  deleteRole(role: Role): void {
    if (!confirm(`Delete role ${role.name}?`)) return;
    this.apiService.delete(`/roles/${role.id}`).subscribe({
      next: () => {
        this.snackBar.open('Role deleted successfully', 'Close', { duration: 3000 });
        this.loadRoles();
      },
      error: (err) => {
        console.error('Failed to delete role:', err);
        this.snackBar.open('Failed to delete role', 'Close', { duration: 3000 });
      }
    });
  }
}
