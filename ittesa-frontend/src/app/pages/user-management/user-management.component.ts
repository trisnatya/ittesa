import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { User, Role } from '../../models';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-800">User Management</h1>
        <button (click)="openModal()" class="btn btn-primary">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          Add User
        </button>
      </div>

      <!-- User Table -->
      <div class="card">
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let user of users">
                <td>{{ user.fullName }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.role?.name || '-' }}</td>
                <td>
                  <span [class]="user.isActive ? 'badge badge-success' : 'badge badge-danger'">
                    {{ user.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td>{{ user.createdAt | date:'short' }}</td>
                <td>
                  <div class="flex gap-2">
                    <button (click)="editUser(user)" class="btn btn-sm btn-secondary">Edit</button>
                    <button (click)="toggleStatus(user)" class="btn btn-sm" [class]="user.isActive ? 'btn-warning' : 'btn-success'">
                      {{ user.isActive ? 'Deactivate' : 'Activate' }}
                    </button>
                    <button (click)="deleteUser(user)" class="btn btn-sm btn-danger">Delete</button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="users.length === 0">
                <td colspan="6" class="text-center py-8 text-gray-500">
                  No users found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Create/Edit Modal -->
      <div *ngIf="showModal" class="modal-overlay" (click)="closeModal()">
        <div class="modal w-full max-w-lg" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title">{{ isEdit ? 'Edit User' : 'Add User' }}</h3>
            <button (click)="closeModal()" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="space-y-4">
              <div class="form-group">
                <label class="form-label">Full Name</label>
                <input type="text" [(ngModel)]="formData.fullName" class="form-input" placeholder="Enter full name" />
              </div>
              <div class="form-group">
                <label class="form-label">Email</label>
                <input type="email" [(ngModel)]="formData.email" class="form-input" placeholder="Enter email" />
              </div>
              <div class="form-group">
                <label class="form-label">Password <span *ngIf="isEdit">(Leave blank to keep current)</span></label>
                <input type="password" [(ngModel)]="formData.password" class="form-input" placeholder="Enter password" />
              </div>
              <div class="form-group">
                <label class="form-label">Role</label>
                <select [(ngModel)]="formData.roleId" class="form-input">
                  <option value="">Select Role</option>
                  <option *ngFor="let role of roles" [value]="role.id">{{ role.name }}</option>
                </select>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button (click)="closeModal()" class="btn btn-secondary">Cancel</button>
            <button (click)="saveUser()" class="btn btn-primary">Save</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  roles: Role[] = [];
  showModal = false;
  isEdit = false;
  formData: any = { fullName: '', email: '', password: '', roleId: '', isActive: true };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
  }

  loadUsers(): void {
    this.apiService.get<User[]>('/users').subscribe({
      next: (data) => this.users = data,
      error: () => this.users = []
    });
  }

  loadRoles(): void {
    this.apiService.get<Role[]>('/roles').subscribe({
      next: (data) => this.roles = data,
      error: () => this.roles = []
    });
  }

  openModal(): void {
    this.isEdit = false;
    this.formData = { fullName: '', email: '', password: '', roleId: '', isActive: true };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  editUser(user: User): void {
    this.isEdit = true;
    this.formData = { ...user, password: '', roleId: user.roleId || '' };
    this.showModal = true;
  }

  saveUser(): void {
    const action = this.isEdit
      ? this.apiService.put(`/users/${this.formData.id}`, this.formData)
      : this.apiService.post('/users', this.formData);

    action.subscribe({
      next: () => {
        this.closeModal();
        this.loadUsers();
      },
      error: (err) => console.error('Failed to save user:', err)
    });
  }

  toggleStatus(user: User): void {
    this.apiService.patch(`/users/${user.id}`, { isActive: !user.isActive }).subscribe({
      next: () => this.loadUsers(),
      error: (err) => console.error('Failed to toggle status:', err)
    });
  }

  deleteUser(user: User): void {
    if (!confirm('Delete this user?')) return;
    this.apiService.delete(`/users/${user.id}`).subscribe({
      next: () => this.loadUsers(),
      error: (err) => console.error('Failed to delete user:', err)
    });
  }
}
