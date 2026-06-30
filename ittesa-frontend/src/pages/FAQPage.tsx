import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { faqsApi } from '@/services/api';
import { Faq } from '@/types';
import { Plus, Edit, Trash2, X, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

export function FAQPage() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaq, setSelectedFaq] = useState<Faq | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: '',
    order: 0,
  });

  const { data: faqs = [], isLoading } = useQuery({
    queryKey: ['faqs'],
    queryFn: async () => {
      const response = await faqsApi.getAll();
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => faqsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => faqsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => faqsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
    },
  });

  const filteredFaqs = faqs.filter(
    (faq: Faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openModal = (faq?: Faq) => {
    if (faq) {
      setEditingFaq(faq);
      setFormData({
        question: faq.question,
        answer: faq.answer,
        category: faq.category || '',
        order: faq.order,
      });
    } else {
      setEditingFaq(null);
      setFormData({ question: '', answer: '', category: '', order: 0 });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingFaq(null);
    setFormData({ question: '', answer: '', category: '', order: 0 });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFaq) {
      updateMutation.mutate({ id: editingFaq.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const isAdmin = user?.role?.name === 'admin';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">FAQ Management</h1>
        {isAdmin && (
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus size={18} />
            Add FAQ
          </button>
        )}
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="relative max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* FAQ List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No FAQs found</div>
        ) : (
          filteredFaqs.map((faq: Faq) => (
            <FAQItem
              key={faq.id}
              faq={faq}
              onEdit={() => openModal(faq)}
              onDelete={() => {
                if (confirm('Are you sure you want to delete this FAQ?')) {
                  deleteMutation.mutate(faq.id);
                }
              }}
              isAdmin={isAdmin}
            />
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold">
                {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Answer *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? 'Saving...'
                    : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function FAQItem({
  faq,
  onEdit,
  onDelete,
  isAdmin,
}: {
  faq: Faq;
  onEdit: () => void;
  onDelete: () => void;
  isAdmin: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-3">
          <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded">
            {faq.category || 'General'}
          </span>
          <span className="font-medium text-gray-900">{faq.question}</span>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={onEdit}
                className="p-1 text-gray-400 hover:text-primary-600"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={onDelete}
                className="p-1 text-gray-400 hover:text-red-600"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
          {isOpen ? (
            <ChevronUp size={20} className="text-gray-400" />
          ) : (
            <ChevronDown size={20} className="text-gray-400" />
          )}
        </div>
      </button>
      {isOpen && (
        <div className="mt-3 ml-11 text-gray-600 leading-relaxed">{faq.answer}</div>
      )}
    </div>
  );
}