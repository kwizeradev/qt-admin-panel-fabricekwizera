import { useState, useEffect, useCallback } from 'react';
import { User, CreateUserDTO, UpdateUserDTO } from '../types';
import { getAllUsers, createUser, updateUser, deleteUser, getPublicKey } from '../services/api';
import { verifyAndFilterUsers } from '../services/crypto';

interface UseUsersState {
  users: User[];
  loading: boolean;
  error: string | null;
}

interface UseUsersActions {
  refetch: () => Promise<void>;
  create: (userData: CreateUserDTO) => Promise<void>;
  update: (id: number, userData: UpdateUserDTO) => Promise<void>;
  remove: (id: number) => Promise<void>;
}

export const useUsers = (): UseUsersState & UseUsersActions => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [allUsers, publicKeyData] = await Promise.all([
        getAllUsers(),
        getPublicKey()
      ]);

      const verifiedUsers = await verifyAndFilterUsers(allUsers, publicKeyData.publicKey);
      setUsers(verifiedUsers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (userData: CreateUserDTO) => {
    try {
      setError(null);
      await createUser(userData);
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
      throw err;
    }
  }, [fetchUsers]);

  const update = useCallback(async (id: number, userData: UpdateUserDTO) => {
    try {
      setError(null);
      await updateUser(id, userData);
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
      throw err;
    }
  }, [fetchUsers]);

  const remove = useCallback(async (id: number) => {
    try {
      setError(null);
      await deleteUser(id);
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
      throw err;
    }
  }, [fetchUsers]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
    create,
    update,
    remove,
  };
};