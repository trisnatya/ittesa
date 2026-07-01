import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { EmailTemplate } from '../../models';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-email-template',
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
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">Email Template Management</h1>
        <button mat-raised-button color="primary" (click)="openAddDialog()">
          <mat-icon>add</mat-icon>
          Add Template
        </button>
      </div>

      <!-- Template Table -->
      <mat-card class="table-card">
        <mat-card-content>
          <div class="table-container">
            <table mat-table [dataSource]="dataSource" matSort class="templates-table">
              <!-- Name Column -->
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
                <td mat-cell *matCellDef="let template">{{ template.name }}</td>
              </ng-container>

              <!-- Subject Column -->
              <ng-container matColumnDef="subject">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Subject</th>
                <td mat-cell *matCellDef="let template">{{ template.subject }}</td>
              </ng-container>

              <!-- Preview Column -->
              <ng-container matColumnDef="body">
                <th mat-header-cell *matHeaderCellDef>Preview</th>
                <td mat-cell *matCellDef="let template" class="preview-cell">{{ template.body | slice:0:50 }}...</td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let template">
                  <button mat-icon-button matTooltip="Send Email" color="primary" (click)="sendEmail(template)">
                    <mat-icon>send</mat-icon>
                  </button>
                  <button mat-icon-button matTooltip="Edit" (click)="editTemplate(template)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button matTooltip="Delete" color="warn" (click)="deleteTemplate(template)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

              <!-- No Data Row -->
              <tr class="mat-row" *matNoDataRow>
                <td class="mat-cell no-data-cell" [attr.colspan]="displayedColumns.length">
                  No templates found
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
    .templates-table {
      width: 100%;
    }
    .preview-cell {
      max-width: 200px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
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
export class EmailTemplateComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  templates: EmailTemplate[] = [];
  dataSource = new MatTableDataSource<EmailTemplate>();
  displayedColumns = ['name', 'subject', 'body', 'actions'];
  showModal = false;
  showSendModal = false;
  isEdit = false;
  selectedTemplate: EmailTemplate | null = null;
  recipientEmail = '';
  replacementsJson = '{}';
  loading = false;
  formData: any = { name: '', subject: '', body: '' };

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadTemplates();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadTemplates(): void {
    this.loading = true;
    this.apiService.get<EmailTemplate[]>('/email-templates').subscribe({
      next: (data) => {
        this.templates = data;
        this.dataSource.data = this.templates;
        this.loading = false;
      },
      error: () => {
        this.templates = [];
        this.dataSource.data = [];
        this.loading = false;
      }
    });
  }

  openAddDialog(): void {
    this.isEdit = false;
    this.formData = { name: '', subject: '', body: '' };
    this.snackBar.open('Add template dialog - to be implemented', 'Close', { duration: 3000 });
  }

  closeModal(): void {
    this.showModal = false;
  }

  editTemplate(template: EmailTemplate): void {
    this.isEdit = true;
    this.formData = { ...template };
    this.snackBar.open(`Editing template: ${template.name}`, 'Close', { duration: 2000 });
  }

  saveTemplate(): void {
    const action = this.isEdit
      ? this.apiService.put(`/email-templates/${this.formData.id}`, this.formData)
      : this.apiService.post('/email-templates', this.formData);

    action.subscribe({
      next: () => {
        this.snackBar.open('Template saved successfully', 'Close', { duration: 3000 });
        this.closeModal();
        this.loadTemplates();
      },
      error: (err) => {
        console.error('Failed to save template:', err);
        this.snackBar.open('Failed to save template', 'Close', { duration: 3000 });
      }
    });
  }

  deleteTemplate(template: EmailTemplate): void {
    if (!confirm(`Delete template ${template.name}?`)) return;
    this.apiService.delete(`/email-templates/${template.id}`).subscribe({
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

  sendEmail(template: EmailTemplate): void {
    this.selectedTemplate = template;
    this.recipientEmail = '';
    this.replacementsJson = '{}';
    this.snackBar.open('Send email dialog - to be implemented', 'Close', { duration: 3000 });
  }

  closeSendModal(): void {
    this.showSendModal = false;
    this.selectedTemplate = null;
  }

  confirmSendEmail(): void {
    if (!this.selectedTemplate || !this.recipientEmail) {
      this.snackBar.open('Please enter recipient email', 'Close', { duration: 3000 });
      return;
    }

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
        this.snackBar.open('Email sent successfully!', 'Close', { duration: 3000 });
        this.closeSendModal();
      },
      error: (err) => {
        console.error('Failed to send email:', err);
        this.snackBar.open('Failed to send email', 'Close', { duration: 3000 });
      }
    });
  }
}
