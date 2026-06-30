import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rolesApi } from '@/services/api';
import { Role } from '@/types';
import { Plus, Edit, Trash2, X, Shield } from 'lucide-react';

const PERMISSIONS = [
  'read', 'create', 'update', 'delete', 'export', 'send', 'answer'
];

const MODULES = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'employees', label: 'Employees' },
  { key: 'requests', label: 'Requests' },
  { key: 'templates', label: 'Templates' },
  { key: 'emailTemplates', label: 'Email Templates' },
  { key: 'faqs', label: 'FAQs' },
  { key: 'questions', label: 'Questions' },
  { key: 'users', label: 'Users' },
  { key: 'roles', label: 'Roles' },
  { key: 'userLogs', label: 'User Logs' },
];

export function RoleManagementPage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    permissions: {} as Record<string, string[]>,
  });

  const { data: roles = [], isLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const response = await rolesApi.getAll();
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => rolesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => rolesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => rolesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });

  const openModal = (role?: Role) => {
    if (role) {
      setEditingRole(role);
      setFormData({
        name: role.name,
        permissions: role.permissions || {},
      });
    } else {
      setEditingRole(null);
      setFormData({
        name: '',
        permissions: {},
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingRole(null);
    setFormData({ name: '', permissions: {} });
  };

  const handlePermissionChange = (module: string, permission: string, checked: boolean) => {
    const currentPermissions = formData.permissions[module] || [];
    if (checked) {
      setFormData({
        ...formData,
        permissions: {
          ...formData.permissions,
          [module]: [...currentPermissions, permission],
        },
      });
    } else {
      setFormData({
        ...formData,
        permissions: {
          ...formData.permissions,
          [module]: currentPermissions.filter((p) => p !== permission),
        },
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRole) {
      updateMutation.mutate({ id: editingRole.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Role Management</h1>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus size={18} />
          Add Role
        </button>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : roles.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center text-gray-500">
            No roles found
          </div>
        ) : (
          roles.map((role: Role) => (
            <div
              key={role.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Shield className="text-primary-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 capitalize">{role.name}</h3>
                    <p className="text-sm text-gray-500">
                      {Object.keys(role.permissions || {}).length} modules
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openModal(role)}
                    className="p-2 text-gray-400 hover:text-primary-600"
                  >
                    <Edit size={16} />
                  </button>
                  {role.name !== 'admin' && (
                    <button
                      onClick={() => {
                        if (confirm('Are you sure?')) {
                          deleteMutation.mutate(role.id);
                        }
                      }}
                      className="p-2 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(role.permissions || {}).map(([module, perms]) =>
                  (perms as string[]).map((perm) => (
                    <span
                      key={`${module}-${perm}`}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                    >
                      {module}.{perm}
                    </span>
                  ))
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold">
                {editingRole ? 'Edit Role' : 'Add New Role'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., manager, editor"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Permissions
                </label>
                <div className="space-y-4">
                  {MODULES.map((module) => (
                    <div key={module.key} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">{module.label}</h4>
                      <div className="flex flex-wrap gap-4">
                        {PERMISSIONS.map((permission) => (
                          <label
                            key={permission}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={
                                formData.permissions[module.key]?.includes(permission) || false
                              }
                              onChange={(e) =>
                                handlePermissionChange(module.key, permission, e.target.checked)
                              }
                              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                            />
                            <span className="text-sm text-gray-700 capitalize">{permission}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
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
                  {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}