import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Role } from '../../models';

@Component({
  selector: 'app-role-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-800">User Role Management</h1>
        <button (click)="openModal()" class="btn btn-primary">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          Add Role
        </button>
      </div>

      <!-- Role Table -->
      <div class="card">
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Role Name</th>
                <th>Permissions</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let role of roles">
                <td class="font-medium">{{ role.name }}</td>
                <td>
                  <div class="flex flex-wrap gap-1">
                    <span *ngFor="let perm of getPermissions(role)" class="badge badge-gray text-xs">
                      {{ perm }}
                    </span>
                  </div>
                </td>
                <td>{{ role.createdAt | date:'short' }}</td>
                <td>
                  <div class="flex gap-2">
                    <button (click)="editRole(role)" class="btn btn-sm btn-secondary">Edit</button>
                    <button (click)="deleteRole(role)" class="btn btn-sm btn-danger">Delete</button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="roles.length === 0">
                <td colspan="4" class="text-center py-8 text-gray-500">
                  No roles found
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
            <h3 class="modal-title">{{ isEdit ? 'Edit Role' : 'Add Role' }}</h3>
            <button (click)="closeModal()" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Role Name</label>
              <input type="text" [(ngModel)]="formData.name" class="form-input" placeholder="Enter role name" />
            </div>
            <div class="form-group">
              <label class="form-label">Permissions</label>
              <div class="grid grid-cols-2 gap-2">
                <label *ngFor="let perm of availablePermissions" class="flex items-center gap-2 p-2 border border-gray-200 rounded cursor-pointer hover:bg-gray-50">
                  <input type="checkbox" [checked]="hasPermission(perm)" (change)="togglePermission(perm)" class="rounded" />
                  <span class="text-sm">{{ perm }}</span>
                </label>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button (click)="closeModal()" class="btn btn-secondary">Cancel</button>
            <button (click)="saveRole()" class="btn btn-primary">Save</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RoleManagementComponent implements OnInit {
  roles: Role[] = [];
  showModal = false;
  isEdit = false;
  availablePermissions = ['dashboard', 'employees', 'requests', 'faqs', 'questions', 'users', 'roles', 'email-templates', 'user-logs'];
  formData: any = { name: '', permissions: [] as string[] };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.apiService.get<Role[]>('/roles').subscribe({
      next: (data) => this.roles = data,
      error: () => this.roles = []
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

  openModal(): void {
    this.isEdit = false;
    this.formData = { name: '', permissions: [] };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  editRole(role: Role): void {
    this.isEdit = true;
    this.formData = { ...role, permissions: [...(role.permissions || [])] };
    this.showModal = true;
  }

  saveRole(): void {
    const action = this.isEdit
      ? this.apiService.put(`/roles/${this.formData.id}`, this.formData)
      : this.apiService.post('/roles', this.formData);

    action.subscribe({
      next: () => {
        this.closeModal();
        this.loadRoles();
      },
      error: (err) => console.error('Failed to save role:', err)
    });
  }

  deleteRole(role: Role): void {
    if (!confirm('Delete this role?')) return;
    this.apiService.delete(`/roles/${role.id}`).subscribe({
      next: () => this.loadRoles(),
      error: (err) => console.error('Failed to delete role:', err)
    });
  }
}
