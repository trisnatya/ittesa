import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { EmailTemplate } from '../../models';

@Component({
  selector: 'app-email-template',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-800">Email Template Management</h1>
        <button (click)="openModal()" class="btn btn-primary">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          Add Template
        </button>
      </div>

      <!-- Template Table -->
      <div class="card">
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Subject</th>
                <th>Preview</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let template of templates">
                <td class="font-medium">{{ template.name }}</td>
                <td>{{ template.subject }}</td>
                <td class="max-w-xs truncate">{{ template.body }}</td>
                <td>
                  <div class="flex gap-2">
                    <button (click)="sendEmail(template)" class="btn btn-sm btn-success">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                      Send
                    </button>
                    <button (click)="editTemplate(template)" class="btn btn-sm btn-secondary">Edit</button>
                    <button (click)="deleteTemplate(template)" class="btn btn-sm btn-danger">Delete</button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="templates.length === 0">
                <td colspan="4" class="text-center py-8 text-gray-500">
                  No templates found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Create/Edit Modal -->
      <div *ngIf="showModal" class="modal-overlay" (click)="closeModal()">
        <div class="modal w-full max-w-2xl" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title">{{ isEdit ? 'Edit Template' : 'Add Template' }}</h3>
            <button (click)="closeModal()" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="space-y-4">
              <div class="form-group">
                <label class="form-label">Template Name</label>
                <input type="text" [(ngModel)]="formData.name" class="form-input" placeholder="e.g. Welcome Email" />
              </div>
              <div class="form-group">
                <label class="form-label">Subject</label>
                <input type="text" [(ngModel)]="formData.subject" class="form-input" placeholder="Email subject" />
              </div>
              <div class="form-group">
                <label class="form-label">Body</label>
                <textarea [(ngModel)]="formData.body" class="form-input" rows="8" placeholder="Email body content..."></textarea>
                <p class="text-xs text-gray-500 mt-1">Use {{'{{'}}name{{'}}'}}, {{'{{'}}email{{'}}'}} for dynamic replacements</p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button (click)="closeModal()" class="btn btn-secondary">Cancel</button>
            <button (click)="saveTemplate()" class="btn btn-primary">Save</button>
          </div>
        </div>
      </div>

      <!-- Send Email Modal -->
      <div *ngIf="showSendModal" class="modal-overlay" (click)="closeSendModal()">
        <div class="modal w-full max-w-md" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title">Send Email</h3>
            <button (click)="closeSendModal()" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="space-y-4">
              <div class="form-group">
                <label class="form-label">Recipient Email</label>
                <input type="email" [(ngModel)]="recipientEmail" class="form-input" placeholder="recipient@example.com" />
              </div>
              <div class="form-group">
                <label class="form-label">Replacements (JSON)</label>
                <textarea [(ngModel)]="replacementsJson" class="form-input" rows="4" placeholder='{"name": "John", "company": "Acme"}'></textarea>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button (click)="closeSendModal()" class="btn btn-secondary">Cancel</button>
            <button (click)="confirmSendEmail()" class="btn btn-primary">Send</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class EmailTemplateComponent implements OnInit {
  templates: EmailTemplate[] = [];
  showModal = false;
  showSendModal = false;
  isEdit = false;
  selectedTemplate: EmailTemplate | null = null;
  recipientEmail = '';
  replacementsJson = '{}';
  formData: any = { name: '', subject: '', body: '' };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadTemplates();
  }

  loadTemplates(): void {
    this.apiService.get<EmailTemplate[]>('/email-templates').subscribe({
      next: (data) => this.templates = data,
      error: () => this.templates = []
    });
  }

  openModal(): void {
    this.isEdit = false;
    this.formData = { name: '', subject: '', body: '' };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  editTemplate(template: EmailTemplate): void {
    this.isEdit = true;
    this.formData = { ...template };
    this.showModal = true;
  }

  saveTemplate(): void {
    const action = this.isEdit
      ? this.apiService.put(`/email-templates/${this.formData.id}`, this.formData)
      : this.apiService.post('/email-templates', this.formData);

    action.subscribe({
      next: () => {
        this.closeModal();
        this.loadTemplates();
      },
      error: (err) => console.error('Failed to save template:', err)
    });
  }

  deleteTemplate(template: EmailTemplate): void {
    if (!confirm('Delete this template?')) return;
    this.apiService.delete(`/email-templates/${template.id}`).subscribe({
      next: () => this.loadTemplates(),
      error: (err) => console.error('Failed to delete template:', err)
    });
  }

  sendEmail(template: EmailTemplate): void {
    this.selectedTemplate = template;
    this.recipientEmail = '';
    this.replacementsJson = '{}';
    this.showSendModal = true;
  }

  closeSendModal(): void {
    this.showSendModal = false;
    this.selectedTemplate = null;
  }

  confirmSendEmail(): void {
    if (!this.selectedTemplate || !this.recipientEmail) return;

    let replacements: any = {};
    try {
      replacements = JSON.parse(this.replacementsJson);
    } catch (e) {
      console.error('Invalid JSON');
    }

    this.apiService.post(`/email-templates/${this.selectedTemplate.id}/send`, {
      to: this.recipientEmail,
      replacements
    }).subscribe({
      next: () => {
        alert('Email sent successfully!');
        this.closeSendModal();
      },
      error: (err) => {
        console.error('Failed to send email:', err);
        alert('Failed to send email');
      }
    });
  }
}
