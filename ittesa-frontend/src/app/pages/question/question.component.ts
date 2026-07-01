import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Question } from '../../models';

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-800">Questions</h1>
        <button (click)="openModal()" class="btn btn-primary">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          Ask Question
        </button>
      </div>

      <!-- Question List -->
      <div class="space-y-4">
        <div *ngFor="let q of questions" class="card">
          <div class="flex gap-4">
            <div class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
              <span class="text-primary-600 font-medium">{{ q.user?.fullName?.charAt(0) || 'U' }}</span>
            </div>
            <div class="flex-1">
              <div class="flex justify-between items-start">
                <div>
                  <p class="font-medium text-gray-800">{{ q.user?.fullName || 'User' }}</p>
                  <p class="text-sm text-gray-500">{{ q.createdAt | date:'medium' }}</p>
                </div>
                <span [class]="getStatusBadge(q.answer)">
                  {{ q.answer ? 'Answered' : 'Pending' }}
                </span>
              </div>
              <p class="mt-2 text-gray-700">{{ q.question }}</p>
              <div *ngIf="q.answer" class="mt-3 p-3 bg-gray-50 rounded-lg">
                <p class="text-sm text-gray-500">Answer:</p>
                <p class="text-gray-700">{{ q.answer }}</p>
              </div>
              <div *ngIf="!q.answer" class="mt-3">
                <textarea [(ngModel)]="answers[q.id]" class="form-input" rows="2" placeholder="Write your answer..."></textarea>
                <button (click)="submitAnswer(q.id)" class="btn btn-primary btn-sm mt-2">Submit Answer</button>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="questions.length === 0" class="text-center py-8 text-gray-500">
          No questions found
        </div>
      </div>

      <!-- Ask Question Modal -->
      <div *ngIf="showModal" class="modal-overlay" (click)="closeModal()">
        <div class="modal w-full max-w-lg" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title">Ask a Question</h3>
            <button (click)="closeModal()" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Your Question</label>
              <textarea [(ngModel)]="newQuestion" class="form-input" rows="4" placeholder="Type your question here..."></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button (click)="closeModal()" class="btn btn-secondary">Cancel</button>
            <button (click)="submitQuestion()" class="btn btn-primary">Submit</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class QuestionComponent implements OnInit {
  questions: Question[] = [];
  showModal = false;
  newQuestion = '';
  answers: { [key: string]: string } = {};

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadQuestions();
  }

  loadQuestions(): void {
    this.apiService.get<Question[]>('/questions').subscribe({
      next: (data) => this.questions = data,
      error: () => this.questions = []
    });
  }

  getStatusBadge(hasAnswer: string | undefined): string {
    return hasAnswer ? 'badge badge-success' : 'badge badge-warning';
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.newQuestion = '';
  }

  submitQuestion(): void {
    if (!this.newQuestion.trim()) return;
    this.apiService.post('/questions', { question: this.newQuestion }).subscribe({
      next: () => {
        this.closeModal();
        this.loadQuestions();
      },
      error: (err) => console.error('Failed to submit question:', err)
    });
  }

  submitAnswer(questionId: string): void {
    const answer = this.answers[questionId];
    if (!answer?.trim()) return;
    this.apiService.put(`/questions/${questionId}/answer`, { answer }).subscribe({
      next: () => {
        this.loadQuestions();
      },
      error: (err) => console.error('Failed to submit answer:', err)
    });
  }
}
