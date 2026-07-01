import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { RequestType, Request, Template } from '../../models';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-view-request',
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
    MatTabsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">View Request</h1>
        <button mat-raised-button color="primary" (click)="openCreateModal()">
          <mat-icon>add</mat-icon>
          New Request
        </button>
      </div>

      <!-- Request Type Tabs -->
      <mat-tab-group [(selectedIndex)]="selectedTypeTabIndex" (selectedTabChange)="onTypeTabChange($event)" class="type-tabs">
        <mat-tab>
          <ng-template mat-tab-label>
            <span class="tab-label">All Types</span>
          </ng-template>
        </mat-tab>
        <mat-tab *ngFor="let type of requestTypes">
          <ng-template mat-tab-label>
            <span class="tab-label">{{ type.name }}</span>
            <span class="tab-count">{{ getCountByType(type.id) }}</span>
          </ng-template>
        </mat-tab>
      </mat-tab-group>

      <!-- Status Tabs -->
      <mat-card class="table-card">
        <mat-tab-group [(selectedIndex)]="selectedStatusTabIndex" (selectedTabChange)="onStatusTabChange($event)" class="status-tabs">
          <mat-tab *ngFor="let status of statusTabs">
            <ng-template mat-tab-label>
              <span class="tab-label">{{ status.label }}</span>
              <span class="tab-count">{{ getCountByStatus(status.value) }}</span>
            </ng-template>
          </mat-tab>
        </mat-tab-group>

        <!-- Request Table -->
        <mat-card-content>
          <div class="table-container">
            <table mat-table [dataSource]="dataSource" matSort class="requests-table">
              <!-- Title Column -->
              <ng-container matColumnDef="title">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Title</th>
                <td mat-cell *matCellDef="let request">{{ request.title }}</td>
              </ng-container>

              <!-- Request Type Column -->
              <ng-container matColumnDef="requestType">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Request Type</th>
                <td mat-cell *matCellDef="let request">{{ request.requestType?.name || '-' }}</td>
              </ng-container>

              <!-- Status Column -->
              <ng-container matColumnDef="milestoneStatus">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Status</th>
                <td mat-cell *matCellDef="let request">
                  <span class="status-badge" [ngClass]="getStatusClass(request.milestoneStatus)">
                    {{ request.milestoneStatus | titlecase }}
                  </span>
                </td>
              </ng-container>

              <!-- Created Column -->
              <ng-container matColumnDef="createdAt">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Created</th>
                <td mat-cell *matCellDef="let request">{{ request.createdAt | date:'medium' }}</td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let request">
                  <button mat-icon-button matTooltip="View Details" (click)="viewDetail(request)">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button mat-icon-button matTooltip="Edit" (click)="editRequest(request)">
                    <mat-icon>edit</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

              <!-- No Data Row -->
              <tr class="mat-row" *matNoDataRow>
                <td class="mat-cell no-data-cell" [attr.colspan]="displayedColumns.length">
                  No requests found
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
    .type-tabs, .status-tabs {
      margin-bottom: 1rem;
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
    .table-container {
      overflow-x: auto;
    }
    .requests-table {
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
    .status-badge.complete {
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
    }
  `]
})
export class ViewRequestComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  requestTypes: RequestType[] = [];
  requests: Request[] = [];
  templates: Template[] = [];
  dataSource = new MatTableDataSource<Request>();
  displayedColumns = ['title', 'requestType', 'milestoneStatus', 'createdAt', 'actions'];
  
  selectedType = '';
  selectedTypeTabIndex = 0;
  selectedStatus = 'all';
  selectedStatusTabIndex = 0;
  showModal = false;
  showTemplateModal = false;
  isEdit = false;
  selectedFile: File | null = null;
  newTemplateName = '';
  newTemplateFile: File | null = null;
  loading = false;
  
  formData: any = {
    title: '',
    description: '',
    requestTypeId: '',
    templateId: ''
  };

  statusTabs = [
    { label: 'All', value: 'all' },
    { label: 'Draft', value: 'draft' },
    { label: 'Submitted', value: 'submitted' },
    { label: 'Complete', value: 'complete' },
    { label: 'Rejected', value: 'rejected' }
  ];

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadData(): void {
    this.apiService.get<RequestType[]>('/request-types').subscribe({
      next: (data) => this.requestTypes = data,
      error: () => this.requestTypes = [
        { id: '1', name: 'DPLK' },
        { id: '2', name: 'Housing' },
        { id: '3', name: 'Administration Later' },
        { id: '4', name: 'HC Communication' }
      ]
    });

    this.loadRequests();
    this.loadTemplates();
  }

  loadRequests(): void {
    this.loading = true;
    this.apiService.get<Request[]>('/requests').subscribe({
      next: (data) => {
        this.requests = data;
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.requests = [];
        this.applyFilters();
        this.loading = false;
      }
    });
  }

  loadTemplates(): void {
    this.apiService.get<Template[]>('/templates').subscribe({
      next: (data) => this.templates = data,
      error: () => this.templates = []
    });
  }

  applyFilters(): void {
    let result = this.requests;
    
    if (this.selectedType) {
      result = result.filter(r => r.requestTypeId === this.selectedType);
    }
    
    if (this.selectedStatus !== 'all') {
      result = result.filter(r => r.milestoneStatus === this.selectedStatus);
    }
    
    this.dataSource.data = result;
  }

  onTypeTabChange(event: any): void {
    this.selectedTypeTabIndex = event.index;
    if (event.index === 0) {
      this.selectedType = '';
    } else {
      this.selectedType = this.requestTypes[event.index - 1]?.id || '';
    }
    this.applyFilters();
  }

  onStatusTabChange(event: any): void {
    this.selectedStatusTabIndex = event.index;
    this.selectedStatus = this.statusTabs[event.index].value;
    this.applyFilters();
  }

  getCountByType(typeId: string): number {
    return this.requests.filter(r => r.requestTypeId === typeId).length;
  }

  getCountByStatus(status: string): number {
    if (status === 'all') return this.requests.length;
    return this.requests.filter(r => r.milestoneStatus === status).length;
  }

  getStatusClass(status: string): string {
    return status || 'draft';
  }

  openCreateModal(): void {
    this.isEdit = false;
    this.formData = { title: '', description: '', requestTypeId: '', templateId: '' };
    this.selectedFile = null;
    this.snackBar.open('Create request dialog - to be implemented', 'Close', { duration: 3000 });
  }

  editRequest(request: Request): void {
    this.isEdit = true;
    this.formData = { ...request };
    this.snackBar.open(`Editing: ${request.title}`, 'Close', { duration: 2000 });
  }

  viewDetail(request: Request): void {
    this.snackBar.open(`Viewing: ${request.title}`, 'Close', { duration: 2000 });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onTemplateFileSelected(event: any): void {
    this.newTemplateFile = event.target.files[0];
  }

  saveDraft(): void {
    this.formData.milestoneStatus = 'draft';
    this.saveRequest();
  }

  submitRequest(): void {
    this.formData.milestoneStatus = 'submitted';
    this.saveRequest();
  }

  saveRequest(): void {
    const formData = new FormData();
    Object.keys(this.formData).forEach(key => {
      if (this.formData[key]) formData.append(key, this.formData[key]);
    });
    if (this.selectedFile) formData.append('file', this.selectedFile);

    const action = this.isEdit 
      ? this.apiService.post(`/requests/${this.formData.id}`, formData)
      : this.apiService.post('/requests', formData);

    action.subscribe({
      next: () => {
        this.snackBar.open('Request saved successfully', 'Close', { duration: 3000 });
        this.loadRequests();
      },
      error: (err) => {
        console.error('Failed to save request:', err);
        this.snackBar.open('Failed to save request', 'Close', { duration: 3000 });
      }
    });
  }

  openTemplateModal(): void {
    this.showTemplateModal = true;
  }

  closeTemplateModal(): void {
    this.showTemplateModal = false;
    this.newTemplateName = '';
    this.newTemplateFile = null;
  }

  createTemplate(): void {
    if (!this.newTemplateName || !this.newTemplateFile) {
      this.snackBar.open('Please fill in template name and select a file', 'Close', { duration: 3000 });
      return;
    }
    
    const formData = new FormData();
    formData.append('name', this.newTemplateName);
    formData.append('requestTypeId', this.selectedType || '1');
    formData.append('file', this.newTemplateFile);

    this.apiService.postFormData('/templates', formData).subscribe({
      next: () => {
        this.snackBar.open('Template created successfully', 'Close', { duration: 3000 });
        this.closeTemplateModal();
        this.loadTemplates();
      },
      error: (err) => {
        console.error('Failed to create template:', err);
        this.snackBar.open('Failed to create template', 'Close', { duration: 3000 });
      }
    });
  }

  deleteTemplate(template: Template): void {
    if (!confirm('Delete this template?')) return;
    this.apiService.delete(`/templates/${template.id}`).subscribe({
      next: () => {
        this.snackBar.open('Template deleted successfully', 'Close', { duration: 3000 });
        this.loadTemplates();
      },
      error: (err) => {
        console.error('Failed to delete template:', err);
        this.snackBar.open('Failed to delete template', 'Close', { duration: 3000 });
      }
    });
  }
}
