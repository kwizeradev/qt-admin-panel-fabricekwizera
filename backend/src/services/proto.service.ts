import protobuf from 'protobufjs';
import path from 'path';
import { User } from '../types';

const PROTO_PATH = path.join(__dirname, '../proto/user.proto');

let userProtoRoot: protobuf.Root | null = null;

const loadProto = async (): Promise<protobuf.Root> => {
  if (userProtoRoot) {
    return userProtoRoot;
  }

  try {
    userProtoRoot = await protobuf.load(PROTO_PATH);
    console.log('Protocol Buffer schema loaded');
    return userProtoRoot;
  } catch (error) {
    console.error('Error loading proto file:', error);
    throw new Error('Failed to load Protocol Buffer schema');
  }
};

export const encodeUsers = async (users: User[]): Promise<Buffer> => {
  try {
    const root = await loadProto();

    const UserList = root.lookupType('UserList');

    const payload = {
      users: users,
      total: users.length,
    };

    const errMsg = UserList.verify(payload);
    if (errMsg) {
      throw new Error(`Payload verification failed: ${errMsg}`);
    }

    const message = UserList.create(payload);

    const buffer = UserList.encode(message).finish();

    console.log(`Encoded ${users.length} users to protobuf (${buffer.length} bytes)`);

    return Buffer.from(buffer);
  } catch (error) {
    console.error('Error encoding users to protobuf:', error);
    throw new Error('Failed to encode users to Protocol Buffer format');
  }
};

// Decode : testing
export const decodeUsers = async (buffer: Buffer): Promise<User[]> => {
  try {
    const root = await loadProto();

    const UserList = root.lookupType('UserList');

    const message = UserList.decode(buffer);

    const object = UserList.toObject(message, {
      longs: Number,
      enums: String,
      bytes: String,
    }) as any;

    return object.users || [];
  } catch (error) {
    console.error('Error decoding protobuf:', error);
    throw new Error('Failed to decode Protocol Buffer data');
  }
};