import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Faq } from '../../models';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-800">FAQ Management</h1>
        <button (click)="openModal()" class="btn btn-primary">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          Add FAQ
        </button>
      </div>

      <!-- FAQ Accordion -->
      <div class="card space-y-4">
        <div *ngFor="let faq of faqs" class="border border-gray-200 rounded-lg overflow-hidden">
          <button 
            (click)="toggleFaq(faq.id)"
            class="w-full px-4 py-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <span class="font-medium text-left">{{ faq.question }}</span>
            <svg [class.rotate-180]="expandedId === faq.id" class="w-5 h-5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          <div *ngIf="expandedId === faq.id" class="px-4 py-3 bg-white">
            <p class="text-gray-600">{{ faq.answer }}</p>
            <div class="mt-3 flex gap-2">
              <button (click)="editFaq(faq)" class="btn btn-sm btn-secondary">Edit</button>
              <button (click)="deleteFaq(faq)" class="btn btn-sm btn-danger">Delete</button>
            </div>
          </div>
        </div>

        <div *ngIf="faqs.length === 0" class="text-center py-8 text-gray-500">
          No FAQs found
        </div>
      </div>

      <!-- Create/Edit Modal -->
      <div *ngIf="showModal" class="modal-overlay" (click)="closeModal()">
        <div class="modal w-full max-w-lg" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title">{{ isEdit ? 'Edit FAQ' : 'Add FAQ' }}</h3>
            <button (click)="closeModal()" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="space-y-4">
              <div class="form-group">
                <label class="form-label">Question</label>
                <input type="text" [(ngModel)]="formData.question" class="form-input" placeholder="Enter question" />
              </div>
              <div class="form-group">
                <label class="form-label">Answer</label>
                <textarea [(ngModel)]="formData.answer" class="form-input" rows="4" placeholder="Enter answer"></textarea>
              </div>
              <div class="form-group">
                <label class="form-label">Category</label>
                <input type="text" [(ngModel)]="formData.category" class="form-input" placeholder="e.g. General, Requests" />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button (click)="closeModal()" class="btn btn-secondary">Cancel</button>
            <button (click)="saveFaq()" class="btn btn-primary">Save</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class FaqComponent implements OnInit {
  faqs: Faq[] = [];
  expandedId: string | null = null;
  showModal = false;
  isEdit = false;
  formData: any = { question: '', answer: '', category: '' };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadFaqs();
  }

  loadFaqs(): void {
    this.apiService.get<Faq[]>('/faqs').subscribe({
      next: (data) => this.faqs = data,
      error: () => this.faqs = []
    });
  }

  toggleFaq(id: string): void {
    this.expandedId = this.expandedId === id ? null : id;
  }

  openModal(): void {
    this.isEdit = false;
    this.formData = { question: '', answer: '', category: '' };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  editFaq(faq: Faq): void {
    this.isEdit = true;
    this.formData = { ...faq };
    this.showModal = true;
  }

  saveFaq(): void {
    const action = this.isEdit 
      ? this.apiService.put(`/faqs/${this.formData.id}`, this.formData)
      : this.apiService.post('/faqs', this.formData);

    action.subscribe({
      next: () => {
        this.closeModal();
        this.loadFaqs();
      },
      error: (err) => console.error('Failed to save FAQ:', err)
    });
  }

  deleteFaq(faq: Faq): void {
    if (!confirm('Delete this FAQ?')) return;
    this.apiService.delete(`/faqs/${faq.id}`).subscribe({
      next: () => this.loadFaqs(),
      error: (err) => console.error('Failed to delete FAQ:', err)
    });
  }
}
