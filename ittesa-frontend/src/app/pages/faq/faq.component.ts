import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Faq } from '../../models';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">FAQ Management</h1>
        <button mat-raised-button color="primary" (click)="openAddDialog()">
          <mat-icon>add</mat-icon>
          Add FAQ
        </button>
      </div>

      <!-- FAQ Accordion -->
      <mat-card class="faq-card">
        <mat-card-content>
          <mat-accordion>
            <mat-expansion-panel *ngFor="let faq of faqs">
              <mat-expansion-panel-header>
                <mat-panel-title>
                  <span class="faq-question">{{ faq.question }}</span>
                </mat-panel-title>
                <mat-panel-description>
                  <span class="faq-category">{{ faq.category || 'General' }}</span>
                </mat-panel-description>
              </mat-expansion-panel-header>
              
              <div class="faq-content">
                <p class="faq-answer">{{ faq.answer }}</p>
                <div class="faq-actions">
                  <button mat-button color="primary" (click)="editFaq(faq)">
                    <mat-icon>edit</mat-icon>
                    Edit
                  </button>
                  <button mat-button color="warn" (click)="deleteFaq(faq)">
                    <mat-icon>delete</mat-icon>
                    Delete
                  </button>
                </div>
              </div>
            </mat-expansion-panel>
          </mat-accordion>

          <div *ngIf="faqs.length === 0" class="no-data-message">
            <mat-icon>info</mat-icon>
            <p>No FAQs found</p>
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
    .faq-card {
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    .faq-question {
      font-weight: 500;
      color: #1f2937;
    }
    .faq-category {
      color: #6b7280;
      font-size: 0.875rem;
    }
    .faq-content {
      padding: 1rem 0;
    }
    .faq-answer {
      color: #4b5563;
      line-height: 1.6;
      margin: 0 0 1rem 0;
    }
    .faq-actions {
      display: flex;
      gap: 0.5rem;
      padding-top: 0.5rem;
      border-top: 1px solid #e5e7eb;
    }
    .no-data-message {
      text-align: center;
      padding: 3rem;
      color: #9ca3af;
    }
    .no-data-message mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 1rem;
    }
    .no-data-message p {
      margin: 0;
    }
    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `]
})
export class FaqComponent implements OnInit {
  faqs: Faq[] = [];
  expandedId: string | null = null;
  showModal = false;
  isEdit = false;
  loading = false;
  formData: any = { question: '', answer: '', category: '' };

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadFaqs();
  }

  loadFaqs(): void {
    this.loading = true;
    this.apiService.get<Faq[]>('/faqs').subscribe({
      next: (data) => {
        this.faqs = data;
        this.loading = false;
      },
      error: () => {
        this.faqs = [];
        this.loading = false;
      }
    });
  }

  toggleFaq(id: string): void {
    this.expandedId = this.expandedId === id ? null : id;
  }

  openAddDialog(): void {
    this.isEdit = false;
    this.formData = { question: '', answer: '', category: '' };
    this.snackBar.open('Add FAQ dialog - to be implemented', 'Close', { duration: 3000 });
  }

  closeModal(): void {
    this.showModal = false;
  }

  editFaq(faq: Faq): void {
    this.isEdit = true;
    this.formData = { ...faq };
    this.snackBar.open(`Editing FAQ: ${faq.question}`, 'Close', { duration: 2000 });
  }

  saveFaq(): void {
    const action = this.isEdit 
      ? this.apiService.put(`/faqs/${this.formData.id}`, this.formData)
      : this.apiService.post('/faqs', this.formData);

    action.subscribe({
      next: () => {
        this.snackBar.open('FAQ saved successfully', 'Close', { duration: 3000 });
        this.closeModal();
        this.loadFaqs();
      },
      error: (err) => {
        console.error('Failed to save FAQ:', err);
        this.snackBar.open('Failed to save FAQ', 'Close', { duration: 3000 });
      }
    });
  }

  deleteFaq(faq: Faq): void {
    if (!confirm('Delete this FAQ?')) return;
    this.apiService.delete(`/faqs/${faq.id}`).subscribe({
      next: () => {
        this.snackBar.open('FAQ deleted successfully', 'Close', { duration: 3000 });
        this.loadFaqs();
      },
      error: (err) => {
        console.error('Failed to delete FAQ:', err);
        this.snackBar.open('Failed to delete FAQ', 'Close', { duration: 3000 });
      }
    });
  }
}
