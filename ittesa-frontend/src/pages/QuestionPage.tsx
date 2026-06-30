import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { questionsApi } from '@/services/api';
import { Question } from '@/types';
import { Plus, MessageSquare, Check, X, Send } from 'lucide-react';
import { format } from 'date-fns';
import { useAuthStore } from '@/stores/authStore';

export function QuestionPage() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [showAskModal, setShowAskModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [newQuestion, setNewQuestion] = useState('');

  const { data: questions = [], isLoading } = useQuery({
    queryKey: ['questions'],
    queryFn: async () => {
      const response = await questionsApi.getAll();
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (question: string) => questionsApi.create(question),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      setShowAskModal(false);
      setNewQuestion('');
    },
  });

  const answerMutation = useMutation({
    mutationFn: ({ id, answer }: { id: string; answer: string }) =>
      questionsApi.answer(id, answer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      setSelectedQuestion(null);
      setAnswerText('');
    },
  });

  const isAdmin = user?.role?.name === 'admin' || user?.role?.name === 'hr';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Questions</h1>
        <button
          onClick={() => setShowAskModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus size={18} />
          Ask Question
        </button>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : questions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No questions yet. Be the first to ask!</p>
          </div>
        ) : (
          questions.map((question: Question) => (
            <div
              key={question.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        question.status === 'answered'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {question.status === 'answered' ? 'Answered' : 'Pending'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {question.user?.fullName || 'Anonymous'} •{' '}
                      {format(new Date(question.createdAt), 'dd MMM yyyy HH:mm')}
                    </span>
                  </div>
                  <p className="text-gray-800 font-medium mb-2">{question.question}</p>
                  {question.answer && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Answer:</p>
                      <p className="text-gray-700">{question.answer}</p>
                    </div>
                  )}
                </div>
                {isAdmin && question.status === 'pending' && (
                  <button
                    onClick={() => {
                      setSelectedQuestion(question);
                      setAnswerText('');
                    }}
                    className="ml-4 px-3 py-1 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    Answer
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Ask Question Modal */}
      {showAskModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Ask a Question</h2>
              <button
                onClick={() => setShowAskModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createMutation.mutate(newQuestion);
              }}
              className="p-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Question
                </label>
                <textarea
                  required
                  rows={4}
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Type your question here..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAskModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <Send size={16} />
                  {createMutation.isPending ? 'Sending...' : 'Submit Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Answer Modal */}
      {selectedQuestion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Answer Question</h2>
              <button
                onClick={() => setSelectedQuestion(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Question:</p>
                <p className="text-gray-800 font-medium bg-gray-50 p-3 rounded-lg">
                  {selectedQuestion.question}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Answer
                </label>
                <textarea
                  required
                  rows={4}
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setSelectedQuestion(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    answerMutation.mutate({ id: selectedQuestion.id, answer: answerText })
                  }
                  disabled={answerMutation.isPending}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <Check size={16} />
                  {answerMutation.isPending ? 'Submitting...' : 'Submit Answer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}