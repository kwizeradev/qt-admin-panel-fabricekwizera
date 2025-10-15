import protobuf from 'protobufjs';
import { User } from '../types';

let userProtoRoot: protobuf.Root | null = null;

const initializeProto = (): protobuf.Root => {
  if (userProtoRoot) {
    return userProtoRoot;
  }

  userProtoRoot = new protobuf.Root();

  const UserType = new protobuf.Type('User')
    .add(new protobuf.Field('id', 1, 'int32'))
    .add(new protobuf.Field('email', 2, 'string'))
    .add(new protobuf.Field('role', 3, 'string'))
    .add(new protobuf.Field('status', 4, 'string'))
    .add(new protobuf.Field('createdAt', 5, 'string'))
    .add(new protobuf.Field('signature', 6, 'string'));

  const UserListType = new protobuf.Type('UserList')
    .add(new protobuf.Field('users', 1, 'User', 'repeated'))
    .add(new protobuf.Field('total', 2, 'int32'));

  userProtoRoot.add(UserType);
  userProtoRoot.add(UserListType);

  return userProtoRoot;
};

export const decodeUsersProtobuf = (buffer: ArrayBuffer): User[] => {
  try {
    const root = initializeProto();
    const UserList = root.lookupType('UserList');

    const uint8Array = new Uint8Array(buffer);
    const message = UserList.decode(uint8Array);

    const decoded = UserList.toObject(message, {
      longs: Number,
      enums: String,
      bytes: String,
    }) as any;

    return decoded.users || [];
  } catch (error) {
    console.error('Failed to decode protobuf:', error);
    throw new Error('Failed to decode protobuf data');
  }
};