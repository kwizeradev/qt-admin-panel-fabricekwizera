import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from './ui/Button';
import StatsCards from './StatsCards';
import UserChart from './UserChart';
import UserTable from './UserTable';
import UserForm from './UserForm';
import { useUsers } from '../hooks/useUsers';
import { useStats } from '../hooks/useStats';
import { User, CreateUserDTO, UpdateUserDTO } from '../types';

const Dashboard: React.FC = () => {
  const { users, loading: usersLoading, error: usersError, create, update, remove } = useUsers();
  const { stats, loading: statsLoading } = useStats();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

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

  const handleDeleteUser = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await remove(id);
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  const handleFormSubmit = async (userData: CreateUserDTO | UpdateUserDTO) => {
    if (formMode === 'create') {
      await create(userData as CreateUserDTO);
    } else if (editingUser) {
      await update(editingUser.id, userData as UpdateUserDTO);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingUser(null);
  };

  if (usersError) {
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">Admin Panel</h1>
              <p className="mt-2 text-gray-600">Manage users and view analytics</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button onClick={handleCreateUser}>
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <StatsCards 
            users={users} 
            stats={stats} 
            loading={usersLoading || statsLoading} 
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <UserChart 
              stats={stats} 
              loading={statsLoading}
              error={null}
              onRetry={undefined}
            />
            
            <div className="lg:col-span-1">
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
    </div>
  );
};

export default Dashboard;