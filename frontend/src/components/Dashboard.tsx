import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from './ui/Button';
import Toast from './ui/Toast';
import ConfirmModal from './ui/ConfirmModal';
import StatsCards from './StatsCards';
import UserChart from './UserChart';
import UserTable from './UserTable';
import UserForm from './UserForm';
import { useUsers } from '../hooks/useUsers';
import { useStats } from '../hooks/useStats';
import { useToast } from '../hooks/useToast';
import { User, CreateUserDTO, UpdateUserDTO } from '../types';

const Dashboard: React.FC = () => {
  const { users, loading: usersLoading, error: usersError, create, update, remove } = useUsers();
  const { stats, loading: statsLoading, refetch: refetchStats } = useStats();
  const { toasts, hideToast, success, error } = useToast();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const handleCreateUser = () => {
    setEditingUser(null);
    setFormMode('create');
    setIsFormOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleDeleteUser = (id: number) => {
    const user = users.find(u => u.id === id);
    if (user) {
      setUserToDelete(user);
      setIsDeleteModalOpen(true);
    }
  };

  const confirmDeleteUser = async () => {
    if (userToDelete) {
      try {
        await remove(userToDelete.id);
        await refetchStats();
        success('User deleted successfully');
      } catch (err) {
        error(err instanceof Error ? err.message : 'Failed to delete user');
      }
      setUserToDelete(null);
    }
  };

  const handleFormSubmit = async (userData: CreateUserDTO | UpdateUserDTO) => {
    if (formMode === 'create') {
      await create(userData as CreateUserDTO);
      await refetchStats();
      success('User created successfully');
    } else if (editingUser) {
      await update(editingUser.id, userData as UpdateUserDTO);
      await refetchStats();
      success('User updated successfully');
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingUser(null);
  };

  if (usersError && users.length === 0 && !usersLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg font-medium mb-2">Error Loading Dashboard</div>
          <div className="text-gray-600">{usersError}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
              <p className="mt-1 text-sm text-gray-600">Manage users and view analytics</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button onClick={handleCreateUser} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <StatsCards 
            users={users} 
            stats={stats} 
            loading={usersLoading || statsLoading} 
          />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2">
              <UserChart 
                stats={stats} 
                loading={statsLoading}
                error={null}
                onRetry={undefined}
              />
            </div>
            
            <div className="lg:col-span-3">
              <UserTable
                users={users}
                loading={usersLoading}
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
                onCreate={handleCreateUser}
              />
            </div>
          </div>
        </div>
      </div>

      <UserForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        user={editingUser}
        mode={formMode}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteUser}
        title="Delete User"
        message={`Are you sure you want to delete ${userToDelete?.email}? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />

      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          onClose={() => hideToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default Dashboard;