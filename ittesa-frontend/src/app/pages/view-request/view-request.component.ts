import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { RequestType, Request, Template } from '../../models';

@Component({
  selector: 'app-view-request',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-800">View Request</h1>
        <button (click)="openCreateModal()" class="btn btn-primary">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          New Request
        </button>
      </div>

      <!-- Request Type Tabs -->
      <div class="tabs">
        <button 
          *ngFor="let type of requestTypes" 
          [class.active]="selectedType === type.id"
          (click)="filterByType(type.id)"
          class="tab">
          {{ type.name }} ({{ getCountByType(type.id) }})
        </button>
      </div>

      <!-- Status Tabs -->
      <div class="card">
        <div class="tabs mb-4">
          <button 
            *ngFor="let status of statusTabs" 
            [class.active]="selectedStatus === status.value"
            (click)="filterByStatus(status.value)"
            class="tab">
            {{ status.label }} ({{ getCountByStatus(status.value) }})
          </button>
        </div>

        <!-- Request List -->
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Request Type</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let request of filteredRequests">
                <td>{{ request.title }}</td>
                <td>{{ request.requestType?.name || '-' }}</td>
                <td>
                  <span [class]="getStatusBadgeClass(request.milestoneStatus)">
                    {{ request.milestoneStatus | titlecase }}
                  </span>
                </td>
                <td>{{ request.createdAt | date:'medium' }}</td>
                <td>
                  <div class="flex gap-2">
                    <button (click)="viewDetail(request)" class="btn btn-sm btn-secondary">Detail</button>
                    <button (click)="editRequest(request)" class="btn btn-sm btn-primary">Edit</button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="filteredRequests.length === 0">
                <td colspan="5" class="text-center py-8 text-gray-500">
                  No requests found
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
            <h3 class="modal-title">{{ isEdit ? 'Edit Request' : 'New Request' }}</h3>
            <button (click)="closeModal()" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="space-y-4">
              <div class="form-group">
                <label class="form-label">Title</label>
                <input type="text" [(ngModel)]="formData.title" class="form-input" placeholder="Request title" />
              </div>
              <div class="form-group">
                <label class="form-label">Request Type</label>
                <select [(ngModel)]="formData.requestTypeId" class="form-input">
                  <option value="">Select Type</option>
                  <option *ngFor="let type of requestTypes" [value]="type.id">{{ type.name }}</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Description</label>
                <textarea [(ngModel)]="formData.description" class="form-input" rows="4" placeholder="Description"></textarea>
              </div>
              <div class="form-group">
                <label class="form-label">Template</label>
                <select [(ngModel)]="formData.templateId" class="form-input">
                  <option value="">Select Template (Optional)</option>
                  <option *ngFor="let template of templates" [value]="template.id">{{ template.name }}</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Attach File (DOCX)</label>
                <div class="file-input">
                  <div class="file-input-label">
                    <svg class="w-8 h-8 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                    </svg>
                    <span>Click to upload or drag and drop</span>
                  </div>
                  <input type="file" (change)="onFileSelected($event)" accept=".docx" />
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button (click)="saveDraft()" class="btn btn-secondary">Save as Draft</button>
            <button (click)="submitRequest()" class="btn btn-primary">Submit</button>
          </div>
        </div>
      </div>

      <!-- Template Management Modal -->
      <div *ngIf="showTemplateModal" class="modal-overlay" (click)="closeTemplateModal()">
        <div class="modal w-full max-w-2xl" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title">Manage Templates</h3>
            <button (click)="closeTemplateModal()" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="mb-4">
              <h4 class="font-medium mb-2">Create New Template</h4>
              <div class="flex gap-2">
                <input type="text" [(ngModel)]="newTemplateName" class="form-input flex-1" placeholder="Template name" />
                <input type="file" (change)="onTemplateFileSelected($event)" accept=".docx" class="form-input flex-1" />
                <button (click)="createTemplate()" class="btn btn-primary">Add</button>
              </div>
            </div>
            <div class="table-container">
              <table class="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let template of templates">
                    <td>{{ template.name }}</td>
                    <td>{{ template.createdAt | date:'short' }}</td>
                    <td>
                      <button (click)="deleteTemplate(template)" class="btn btn-sm btn-danger">Delete</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ViewRequestComponent implements OnInit {
  requestTypes: RequestType[] = [];
  requests: Request[] = [];
  filteredRequests: Request[] = [];
  templates: Template[] = [];
  
  selectedType = '';
  selectedStatus = 'all';
  showModal = false;
  showTemplateModal = false;
  isEdit = false;
  selectedFile: File | null = null;
  newTemplateName = '';
  newTemplateFile: File | null = null;
  
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

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadData();
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
    this.apiService.get<Request[]>('/requests').subscribe({
      next: (data) => {
        this.requests = data;
        this.filterRequests();
      },
      error: () => {
        this.requests = [];
        this.filterRequests();
      }
    });
  }

  loadTemplates(): void {
    this.apiService.get<Template[]>('/templates').subscribe({
      next: (data) => this.templates = data,
      error: () => this.templates = []
    });
  }

  filterByType(typeId: string): void {
    this.selectedType = typeId;
    this.filterRequests();
  }

  filterByStatus(status: string): void {
    this.selectedStatus = status;
    this.filterRequests();
  }

  filterRequests(): void {
    let result = this.requests;
    if (this.selectedType) {
      result = result.filter(r => r.requestTypeId === this.selectedType);
    }
    if (this.selectedStatus !== 'all') {
      result = result.filter(r => r.milestoneStatus === this.selectedStatus);
    }
    this.filteredRequests = result;
  }

  getCountByType(typeId: string): number {
    return this.requests.filter(r => r.requestTypeId === typeId).length;
  }

  getCountByStatus(status: string): number {
    if (status === 'all') return this.requests.length;
    return this.requests.filter(r => r.milestoneStatus === status).length;
  }

  getStatusBadgeClass(status: string): string {
    const classes: { [key: string]: string } = {
      'draft': 'badge badge-gray',
      'submitted': 'badge badge-primary',
      'complete': 'badge badge-success',
      'rejected': 'badge badge-danger'
    };
    return classes[status] || 'badge badge-gray';
  }

  openCreateModal(): void {
    this.isEdit = false;
    this.formData = { title: '', description: '', requestTypeId: '', templateId: '' };
    this.selectedFile = null;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  editRequest(request: Request): void {
    this.isEdit = true;
    this.formData = { ...request };
    this.showModal = true;
  }

  viewDetail(request: Request): void {
    console.log('View:', request);
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
        this.closeModal();
        this.loadRequests();
      },
      error: (err) => console.error('Failed to save request:', err)
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
    if (!this.newTemplateName || !this.newTemplateFile) return;
    
    const formData = new FormData();
    formData.append('name', this.newTemplateName);
    formData.append('requestTypeId', this.selectedType || '1');
    formData.append('file', this.newTemplateFile);

    this.apiService.postFormData('/templates', formData).subscribe({
      next: () => {
        this.closeTemplateModal();
        this.loadTemplates();
      },
      error: (err) => console.error('Failed to create template:', err)
    });
  }

  deleteTemplate(template: Template): void {
    if (!confirm('Delete this template?')) return;
    this.apiService.delete(`/templates/${template.id}`).subscribe({
      next: () => this.loadTemplates(),
      error: (err) => console.error('Failed to delete template:', err)
    });
  }
}
