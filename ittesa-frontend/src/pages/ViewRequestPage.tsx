import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { requestsApi, requestTypesApi, templatesApi, employeesApi } from '@/services/api';
import { Request, RequestType, Template, Employee } from '@/types';
import {
  Plus,
  Eye,
  X,
  Settings,
  FileText,
  Upload,
  Edit,
  Trash2,
} from 'lucide-react';
import { format } from 'date-fns';
import { useAuthStore } from '@/stores/authStore';

const statusTabs = [
  { key: 'all', label: 'All' },
  { key: 'draft', label: 'Draft' },
  { key: 'submitted', label: 'Submitted' },
  { key: 'complete', label: 'Complete' },
  { key: 'rejected', label: 'Rejected' },
];

const statusColors: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  submitted: 'bg-blue-100 text-blue-700',
  complete: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

export function ViewRequestPage() {
  const queryClient = useQueryClient();
  const [activeType, setActiveType] = useState<string>('');
  const [activeStatus, setActiveStatus] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  const { data: requestTypes = [] } = useQuery({
    queryKey: ['request-types'],
    queryFn: async () => {
      const response = await requestTypesApi.getAll();
      return response.data;
    },
  });

  const { data: requests = [] } = useQuery({
    queryKey: ['requests', activeType, activeStatus],
    queryFn: async () => {
      const params: any = {};
      if (activeType) params.requestTypeId = activeType;
      if (activeStatus !== 'all') params.status = activeStatus;
      const response = await requestsApi.getAll(params);
      return response.data;
    },
  });

  const handleTemplateModal = () => {
    setShowTemplateModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">View Request</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus size={18} />
          Create Request
        </button>
      </div>

      {/* Request Type Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveType('')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeType === ''
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Types
            </button>
            {requestTypes.map((type: RequestType) => (
              <button
                key={type.id}
                onClick={() => setActiveType(type.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeType === type.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type.name}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveType(type.id);
                    setShowTemplateModal(true);
                  }}
                  className="p-1 hover:bg-white/20 rounded"
                  title="Manage Templates"
                >
                  <Settings size={14} />
                </button>
              </button>
            ))}
          </div>
        </div>

        {/* Status Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            {statusTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveStatus(tab.key)}
                className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeStatus === tab.key
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Template
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No requests found
                  </td>
                </tr>
              ) : (
                requests.map((request: Request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {request.subject}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {request.requestType?.name || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {request.employee?.fullName || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {request.template?.name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[request.status]}`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {format(new Date(request.createdAt), 'dd MMM yyyy')}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="text-gray-500 hover:text-primary-600"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Request Detail Modal */}
      {selectedRequest && (
        <RequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}

      {/* Create Request Modal */}
      {showCreateModal && (
        <CreateRequestModal
          requestTypes={requestTypes}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {/* Template Management Modal */}
      {showTemplateModal && (
        <TemplateManagementModal
          requestTypeId={activeType}
          requestTypes={requestTypes}
          onClose={() => setShowTemplateModal(false)}
        />
      )}
    </div>
  );
}

function RequestDetailModal({
  request,
  onClose,
}: {
  request: Request;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const { user } = useAuthStore?.() || {};

  const updateStatusMutation = useMutation({
    mutationFn: (status: string) => requestsApi.updateStatus(request.id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      onClose();
    },
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Request Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Subject</p>
              <p className="font-medium">{request.subject}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Type</p>
              <p className="font-medium">{request.requestType?.name || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[request.status]}`}
              >
                {request.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Employee</p>
              <p className="font-medium">{request.employee?.fullName || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Template</p>
              <p className="font-medium">{request.template?.name || '-'}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Description</p>
              <p className="font-medium">{request.description || '-'}</p>
            </div>
            {request.filePath && (
              <div className="col-span-2">
                <p className="text-sm text-gray-500">File</p>
                <a
                  href={`http://localhost:3000/${request.filePath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-800 flex items-center gap-1"
                >
                  <FileText size={16} /> View File
                </a>
              </div>
            )}
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Created</p>
              <p className="font-medium">
                {format(new Date(request.createdAt), 'dd MMM yyyy HH:mm')}
              </p>
            </div>
          </div>

          {/* Status Actions for Admin */}
          {request.status === 'submitted' && (
            <div className="flex gap-2 pt-4 border-t border-gray-200">
              <button
                onClick={() => updateStatusMutation.mutate('complete')}
                disabled={updateStatusMutation.isPending}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                Approve
              </button>
              <button
                onClick={() => updateStatusMutation.mutate('rejected')}
                disabled={updateStatusMutation.isPending}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CreateRequestModal({
  requestTypes,
  onClose,
}: {
  requestTypes: RequestType[];
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    requestTypeId: '',
    employeeId: '',
    subject: '',
    description: '',
    templateId: '',
    status: 'draft',
  });
  const [file, setFile] = useState<File | null>(null);

  const { data: employees = [] } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const response = await employeesApi.getAll();
      return response.data;
    },
  });

  const { data: templates = [] } = useQuery({
    queryKey: ['templates', formData.requestTypeId],
    queryFn: async () => {
      if (!formData.requestTypeId) return [];
      const response = await templatesApi.getAll({ requestTypeId: formData.requestTypeId });
      return response.data;
    },
    enabled: !!formData.requestTypeId,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => requestsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });
    if (file) data.append('file', file);
    createMutation.mutate(data);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Create New Request</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Request Type *
            </label>
            <select
              required
              value={formData.requestTypeId}
              onChange={(e) => setFormData({ ...formData, requestTypeId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select Type</option>
              {requestTypes.map((type: RequestType) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
            <select
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select Employee</option>
              {employees.map((emp: Employee) => (
                <option key={emp.id} value={emp.id}>
                  {emp.fullName} ({emp.nik})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
            <input
              type="text"
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Template</label>
            <select
              value={formData.templateId}
              onChange={(e) => setFormData({ ...formData, templateId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              disabled={!formData.requestTypeId}
            >
              <option value="">Select Template</option>
              {templates.map((tmpl: Template) => (
                <option key={tmpl.id} value={tmpl.id}>
                  {tmpl.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              File (DOCX)
            </label>
            <input
              type="file"
              accept=".docx"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="draft">Draft</option>
              <option value="submitted">Submit</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {createMutation.isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TemplateManagementModal({
  requestTypeId,
  requestTypes,
  onClose,
}: {
  requestTypeId: string;
  requestTypes: RequestType[];
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [selectedTypeId, setSelectedTypeId] = useState(requestTypeId || '');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    file: null as File | null,
  });

  const { data: templates = [] } = useQuery({
    queryKey: ['templates', selectedTypeId],
    queryFn: async () => {
      if (!selectedTypeId) return [];
      const response = await templatesApi.getAll({ requestTypeId: selectedTypeId });
      return response.data;
    },
    enabled: !!selectedTypeId,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => templatesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      setShowAddForm(false);
      setFormData({ name: '', description: '', file: null });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => templatesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      setEditingTemplate(null);
      setFormData({ name: '', description: '', file: null });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => templatesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append('requestTypeId', selectedTypeId);
    data.append('name', formData.name);
    if (formData.description) data.append('description', formData.description);
    if (formData.file) data.append('file', formData.file);

    if (editingTemplate) {
      updateMutation.mutate({ id: editingTemplate.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Template Management</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Request Type
            </label>
            <select
              value={selectedTypeId}
              onChange={(e) => setSelectedTypeId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select Type</option>
              {requestTypes.map((type: RequestType) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          {selectedTypeId && (
            <>
              <div className="mb-4 flex justify-end">
                {!showAddForm && (
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    <Plus size={18} /> Add Template
                  </button>
                )}
              </div>

              {showAddForm && (
                <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
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
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      File (DOCX) *
                    </label>
                    <input
                      type="file"
                      accept=".docx"
                      required={!editingTemplate}
                      onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={createMutation.isPending || updateMutation.isPending}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                    >
                      {editingTemplate ? 'Update' : 'Save'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingTemplate(null);
                        setFormData({ name: '', description: '', file: null });
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Template List */}
              <div className="space-y-3">
                {templates.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    No templates found for this request type
                  </p>
                ) : (
                  templates.map((tmpl: Template) => (
                    <div
                      key={tmpl.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <FileText size={20} className="text-gray-400" />
                        <div>
                          <p className="font-medium">{tmpl.name}</p>
                          <p className="text-sm text-gray-500">{tmpl.description || '-'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingTemplate(tmpl);
                            setFormData({
                              name: tmpl.name,
                              description: tmpl.description || '',
                              file: null,
                            });
                            setShowAddForm(true);
                          }}
                          className="p-2 text-gray-500 hover:text-primary-600"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Are you sure?')) {
                              deleteMutation.mutate(tmpl.id);
                            }
                          }}
                          className="p-2 text-gray-500 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}