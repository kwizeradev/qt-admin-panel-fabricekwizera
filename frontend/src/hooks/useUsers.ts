import { useState, useEffect, useCallback } from 'react';
import { User, CreateUserDTO, UpdateUserDTO } from '../types';
import { createUser, updateUser, deleteUser, getPublicKey, exportUsersProtobuf } from '../services/api';
import { verifyAndFilterUsers } from '../services/crypto';
import { decodeUsersProtobuf } from '../services/protobuf';

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

      const protobufBuffer = await exportUsersProtobuf();
      // Cache public key across fetches
      let keyPem = (fetchUsers as any)._cachedKey as string | undefined;
      if (!keyPem) {
        const publicKeyData = await getPublicKey();
        keyPem = publicKeyData.publicKey;
        (fetchUsers as any)._cachedKey = keyPem;
      }

      const decodedUsers = decodeUsersProtobuf(protobufBuffer);
      const verifiedUsers = await verifyAndFilterUsers(decodedUsers, keyPem);
      setUsers(verifiedUsers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (userData: CreateUserDTO) => {
    await createUser(userData);
    await fetchUsers();
  }, [fetchUsers]);

  const update = useCallback(async (id: number, userData: UpdateUserDTO) => {
    await updateUser(id, userData);
    await fetchUsers();
  }, [fetchUsers]);

  const remove = useCallback(async (id: number) => {
    await deleteUser(id);
    await fetchUsers();
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