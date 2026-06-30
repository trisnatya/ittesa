import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { emailTemplatesApi } from '@/services/api';
import { EmailTemplate } from '@/types';
import { Plus, Edit, Trash2, X, Mail, Send } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

export function EmailTemplatePage() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    body: '',
  });
  const [sendFormData, setSendFormData] = useState({
    to: '',
    replacements: {} as Record<string, string>,
  });

  const { data: emailTemplates = [], isLoading } = useQuery({
    queryKey: ['email-templates'],
    queryFn: async () => {
      const response = await emailTemplatesApi.getAll();
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => emailTemplatesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-templates'] });
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      emailTemplatesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-templates'] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => emailTemplatesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-templates'] });
    },
  });

  const sendMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      emailTemplatesApi.send(id, data),
    onSuccess: () => {
      alert('Email sent successfully!');
      setShowSendModal(false);
      setSelectedTemplate(null);
      setSendFormData({ to: '', replacements: {} });
    },
    onError: () => {
      alert('Failed to send email');
    },
  });

  const openModal = (template?: EmailTemplate) => {
    if (template) {
      setEditingTemplate(template);
      setFormData({
        name: template.name,
        subject: template.subject,
        body: template.body,
      });
    } else {
      setEditingTemplate(null);
      setFormData({ name: '', subject: '', body: '' });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTemplate(null);
    setFormData({ name: '', subject: '', body: '' });
  };

  const openSendModal = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setSendFormData({ to: '', replacements: {} });
    setShowSendModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTemplate) {
      updateMutation.mutate({ id: editingTemplate.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const isAdmin = user?.role?.name === 'admin' || user?.role?.name === 'hr';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Email Templates</h1>
        {isAdmin && (
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus size={18} />
            Add Template
          </button>
        )}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : emailTemplates.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center text-gray-500">
            No email templates found
          </div>
        ) : (
          emailTemplates.map((template: EmailTemplate) => (
            <div
              key={template.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Mail className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                  </div>
                </div>
                {isAdmin && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openModal(template)}
                      className="p-2 text-gray-400 hover:text-primary-600"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure?')) {
                          deleteMutation.mutate(template.id);
                        }
                      }}
                      className="p-2 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Subject:</p>
                <p className="text-gray-800 font-medium">{template.subject}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Body Preview:</p>
                <p className="text-gray-600 text-sm line-clamp-3">{template.body}</p>
              </div>
              <button
                onClick={() => openSendModal(template)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Send size={16} />
                Send Email
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold">
                {editingTemplate ? 'Edit Template' : 'Add New Template'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Template Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Welcome Email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Welcome to ITESSA, {{userName}}!"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Body *
                </label>
                <textarea
                  required
                  rows={8}
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Use {{variableName}} for placeholders..."
                />
                <p className="mt-1 text-xs text-gray-500">
                  Use {'{{variableName}}'} syntax for dynamic content
                </p>
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

      {/* Send Email Modal */}
      {showSendModal && selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Send Email</h2>
              <button
                onClick={() => {
                  setShowSendModal(false);
                  setSelectedTemplate(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Template:</p>
                <p className="font-medium">{selectedTemplate.name}</p>
                <p className="text-sm text-gray-500 mt-2 mb-1">Subject:</p>
                <p className="text-gray-700">{selectedTemplate.subject}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To (Email Address) *
                </label>
                <input
                  type="email"
                  required
                  value={sendFormData.to}
                  onChange={(e) =>
                    setSendFormData({ ...sendFormData, to: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="recipient@example.com"
                />
              </div>

              {/* Extract and show variable replacements */}
              {(() => {
                const variables = selectedTemplate.body.match(/\{\{(\w+)\}\}/g) || [];
                const uniqueVars = [...new Set(variables)];
                if (uniqueVars.length === 0) return null;

                return (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Variable Replacements
                    </label>
                    <div className="space-y-2">
                      {uniqueVars.map((v) => {
                        const varName = v.replace(/\{\{|\}\}/g, '');
                        return (
                          <div key={v}>
                            <label className="block text-xs text-gray-500 mb-1">
                              {'{{' + varName + '}}'}
                            </label>
                            <input
                              type="text"
                              value={sendFormData.replacements[varName] || ''}
                              onChange={(e) =>
                                setSendFormData({
                                  ...sendFormData,
                                  replacements: {
                                    ...sendFormData.replacements,
                                    [varName]: e.target.value,
                                  },
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                              placeholder={`Enter ${varName}`}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowSendModal(false);
                    setSelectedTemplate(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    sendMutation.mutate({
                      id: selectedTemplate.id,
                      data: {
                        to: sendFormData.to,
                        replacements: sendFormData.replacements,
                      },
                    })
                  }
                  disabled={sendMutation.isPending}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <Send size={16} />
                  {sendMutation.isPending ? 'Sending...' : 'Send Email'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}