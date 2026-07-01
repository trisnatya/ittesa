import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Question } from '../../models';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-question',
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
    MatProgressSpinnerModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title">Questions</h1>
        <button mat-raised-button color="primary" (click)="openModal()">
          <mat-icon>add</mat-icon>
          Ask Question
        </button>
      </div>

      <!-- Question List -->
      <div class="questions-list">
        <mat-card *ngFor="let q of questions" class="question-card">
          <mat-card-content>
            <div class="question-header">
              <div class="question-avatar">
                {{ q.user?.fullName?.charAt(0) || 'U' }}
              </div>
              <div class="question-meta">
                <p class="question-author">{{ q.user?.fullName || 'User' }}</p>
                <p class="question-date">{{ q.createdAt | date:'medium' }}</p>
              </div>
              <span class="status-chip" [class.answered]="q.answer" [class.pending]="!q.answer">
                {{ q.answer ? 'Answered' : 'Pending' }}
              </span>
            </div>
            
            <p class="question-text">{{ q.question }}</p>
            
            <div *ngIf="q.answer" class="answer-section">
              <div class="answer-header">
                <mat-icon>check_circle</mat-icon>
                <span>Answer</span>
              </div>
              <p class="answer-text">{{ q.answer }}</p>
            </div>
            
            <div *ngIf="!q.answer" class="answer-form">
              <mat-form-field appearance="outline" class="answer-field">
                <mat-label>Write your answer...</mat-label>
                <textarea matInput [(ngModel)]="answers[q.id]" rows="2"></textarea>
              </mat-form-field>
              <button mat-raised-button color="primary" (click)="submitAnswer(q.id)">
                Submit Answer
              </button>
            </div>
          </mat-card-content>
        </mat-card>

        <div *ngIf="questions.length === 0" class="no-data-message">
          <mat-icon>help_outline</mat-icon>
          <p>No questions found</p>
        </div>
      </div>
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
    .questions-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .question-card {
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    .question-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    .question-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: #e0e7ff;
      color: #4f46e5;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
    }
    .question-meta {
      flex: 1;
    }
    .question-author {
      font-weight: 500;
      color: #1f2937;
      margin: 0;
    }
    .question-date {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
    }
    .status-chip {
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 0.75rem;
      font-weight: 500;
    }
    .status-chip.pending {
      background-color: #fef3c7;
      color: #d97706;
    }
    .status-chip.answered {
      background-color: #d1fae5;
      color: #16a34a;
    }
    .question-text {
      color: #374151;
      line-height: 1.6;
      margin: 0 0 1rem 0;
    }
    .answer-section {
      background-color: #f9fafb;
      padding: 1rem;
      border-radius: 8px;
      margin-top: 1rem;
    }
    .answer-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #16a34a;
      font-weight: 500;
      margin-bottom: 0.5rem;
    }
    .answer-header mat-icon {
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
    }
    .answer-text {
      color: #4b5563;
      margin: 0;
    }
    .answer-form {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-top: 1rem;
    }
    .answer-field {
      width: 100%;
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
export class QuestionComponent implements OnInit {
  questions: Question[] = [];
  showModal = false;
  newQuestion = '';
  answers: { [key: string]: string } = {};
  loading = false;

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadQuestions();
  }

  loadQuestions(): void {
    this.loading = true;
    this.apiService.get<Question[]>('/questions').subscribe({
      next: (data) => {
        this.questions = data;
        this.loading = false;
      },
      error: () => {
        this.questions = [];
        this.loading = false;
      }
    });
  }

  getStatusBadge(hasAnswer: string | undefined): string {
    return hasAnswer ? 'badge badge-success' : 'badge badge-warning';
  }

  openModal(): void {
    this.showModal = true;
    this.snackBar.open('Ask question dialog - to be implemented', 'Close', { duration: 3000 });
  }

  closeModal(): void {
    this.showModal = false;
    this.newQuestion = '';
  }

  submitQuestion(): void {
    if (!this.newQuestion.trim()) {
      this.snackBar.open('Please enter a question', 'Close', { duration: 3000 });
      return;
    }
    this.apiService.post('/questions', { question: this.newQuestion }).subscribe({
      next: () => {
        this.snackBar.open('Question submitted successfully', 'Close', { duration: 3000 });
        this.closeModal();
        this.loadQuestions();
      },
      error: (err) => {
        console.error('Failed to submit question:', err);
        this.snackBar.open('Failed to submit question', 'Close', { duration: 3000 });
      }
    });
  }

  submitAnswer(questionId: string): void {
    const answer = this.answers[questionId];
    if (!answer?.trim()) {
      this.snackBar.open('Please enter an answer', 'Close', { duration: 3000 });
      return;
    }
    this.apiService.put(`/questions/${questionId}/answer`, { answer }).subscribe({
      next: () => {
        this.snackBar.open('Answer submitted successfully', 'Close', { duration: 3000 });
        this.loadQuestions();
      },
      error: (err) => {
        console.error('Failed to submit answer:', err);
        this.snackBar.open('Failed to submit answer', 'Close', { duration: 3000 });
      }
    });
  }
}
