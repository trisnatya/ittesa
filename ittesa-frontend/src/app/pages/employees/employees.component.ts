import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Employee } from '../../models';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-800">Employee Management</h1>
        <div class="flex gap-2">
          <button (click)="exportData()" class="btn btn-secondary">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Export
          </button>
          <button (click)="openModal()" class="btn btn-primary">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            Add Employee
          </button>
        </div>
      </div>

      <!-- Status Tabs -->
      <div class="tabs">
        <button 
          *ngFor="let tab of statusTabs" 
          [class.active]="selectedStatus === tab.value"
          (click)="filterByStatus(tab.value)"
          class="tab">
          {{ tab.label }} ({{ getCountByStatus(tab.value) }})
        </button>
      </div>

      <!-- Search -->
      <div class="card">
        <div class="flex gap-4 mb-4">
          <input
            type="text"
            [(ngModel)]="searchTerm"
            (ngModelChange)="onSearch()"
            placeholder="Search by NIK or Name..."
            class="form-input flex-1"
          />
        </div>

        <!-- Table -->
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>NIK</th>
                <th>Full Name</th>
                <th>Directorate</th>
                <th>Unit</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let employee of filteredEmployees">
                <td>{{ employee.nik }}</td>
                <td>{{ employee.fullName }}</td>
                <td>{{ employee.directorate }}</td>
                <td>{{ employee.unit }}</td>
                <td>
                  <span [class]="getStatusBadgeClass(employee.milestoneStatus)">
                    {{ employee.milestoneStatus | titlecase }}
                  </span>
                </td>
                <td>
                  <div class="flex gap-2">
                    <button (click)="viewDetail(employee)" class="btn btn-sm btn-secondary">
                      Detail
                    </button>
                    <button (click)="editEmployee(employee)" class="btn btn-sm btn-primary">
                      Edit
                    </button>
                    <button (click)="deleteEmployee(employee)" class="btn btn-sm btn-danger">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="filteredEmployees.length === 0">
                <td colspan="6" class="text-center py-8 text-gray-500">
                  No employees found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <div *ngIf="showDetailModal" class="modal-overlay" (click)="closeModal()">
      <div class="modal w-full max-w-lg" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3 class="modal-title">Employee Details</h3>
          <button (click)="closeModal()" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-sm text-gray-500">NIK</label>
                <p class="font-medium">{{ selectedEmployee?.nik }}</p>
              </div>
              <div>
                <label class="text-sm text-gray-500">Full Name</label>
                <p class="font-medium">{{ selectedEmployee?.fullName }}</p>
              </div>
              <div>
                <label class="text-sm text-gray-500">Directorate</label>
                <p class="font-medium">{{ selectedEmployee?.directorate }}</p>
              </div>
              <div>
                <label class="text-sm text-gray-500">Unit</label>
                <p class="font-medium">{{ selectedEmployee?.unit }}</p>
              </div>
              <div>
                <label class="text-sm text-gray-500">Status</label>
                <span [class]="getStatusBadgeClass(selectedEmployee?.milestoneStatus || '')">
                  {{ selectedEmployee?.milestoneStatus | titlecase }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button (click)="closeModal()" class="btn btn-secondary">Close</button>
        </div>
      </div>
    </div>
  `
})
export class EmployeesComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  selectedEmployee: Employee | null = null;
  selectedStatus = 'all';
  searchTerm = '';
  showDetailModal = false;

  statusTabs = [
    { label: 'All', value: 'all' },
    { label: 'Draft', value: 'draft' },
    { label: 'Submitted', value: 'submitted' },
    { label: 'Done', value: 'done' },
    { label: 'Rejected', value: 'rejected' }
  ];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.apiService.get<Employee[]>('/employees').subscribe({
      next: (data) => {
        this.employees = data;
        this.filterEmployees();
      },
      error: (err) => {
        console.error('Failed to load employees:', err);
        // Mock data for demo
        this.employees = [
          { id: '1', nik: 'EMP001', fullName: 'John Doe', directorate: 'IT', unit: 'Development', milestoneStatus: 'draft' },
          { id: '2', nik: 'EMP002', fullName: 'Jane Smith', directorate: 'HR', unit: 'Recruitment', milestoneStatus: 'submitted' },
          { id: '3', nik: 'EMP003', fullName: 'Bob Wilson', directorate: 'Finance', unit: 'Accounting', milestoneStatus: 'done' },
          { id: '4', nik: 'EMP004', fullName: 'Alice Brown', directorate: 'IT', unit: 'Support', milestoneStatus: 'rejected' },
        ];
        this.filterEmployees();
      }
    });
  }

  filterByStatus(status: string): void {
    this.selectedStatus = status;
    this.filterEmployees();
  }

  onSearch(): void {
    this.filterEmployees();
  }

  filterEmployees(): void {
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
    
    this.filteredEmployees = result;
  }

  getCountByStatus(status: string): number {
    if (status === 'all') return this.employees.length;
    return this.employees.filter(e => e.milestoneStatus === status).length;
  }

  getStatusBadgeClass(status: string): string {
    const classes: { [key: string]: string } = {
      'draft': 'badge badge-gray',
      'submitted': 'badge badge-primary',
      'done': 'badge badge-success',
      'rejected': 'badge badge-danger'
    };
    return classes[status] || 'badge badge-gray';
  }

  openModal(): void {
    this.showDetailModal = true;
  }

  closeModal(): void {
    this.showDetailModal = false;
    this.selectedEmployee = null;
  }

  viewDetail(employee: Employee): void {
    this.selectedEmployee = employee;
    this.showDetailModal = true;
  }

  editEmployee(employee: Employee): void {
    console.log('Edit:', employee);
  }

  deleteEmployee(employee: Employee): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.apiService.delete(`/employees/${employee.id}`).subscribe({
        next: () => {
          this.loadEmployees();
        },
        error: (err) => {
          console.error('Failed to delete employee:', err);
        }
      });
    }
  }

  exportData(): void {
    window.open(`${environment.apiUrl}/employees/export`, '_blank');
  }
}
