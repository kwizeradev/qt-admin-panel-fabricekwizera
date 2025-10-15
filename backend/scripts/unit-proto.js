/*
  Unit test: protobuf encode/decode round-trip for UserList.
  Run: node scripts/unit-proto.js
*/

const path = require('node:path');
const protobuf = require('protobufjs');

(async () => {
  const protoPath = path.join(__dirname, '..', 'src', 'proto', 'user.proto');
  const root = await protobuf.load(protoPath);
  const UserList = root.lookupType('UserList');

  const payload = {
    users: [
      {
        id: 1,
        email: 'test@example.com',
        role: 'user',
        status: 'active',
        createdAt: new Date().toISOString(),
        signature: 'deadbeef',
      },
    ],
    total: 1,
  };

  const err = UserList.verify(payload);
  if (err) throw new Error(`Verification failed: ${err}`);

  const msg = UserList.create(payload);
  const buf = UserList.encode(msg).finish();
  const decodedMsg = UserList.decode(buf);
  const obj = UserList.toObject(decodedMsg, { longs: Number, enums: String, bytes: String });

  if (!obj || !obj.users || obj.users.length !== 1 || obj.total !== 1) {
    throw new Error('Round-trip failed: unexpected object structure');
  }

  console.log('UNIT PROTO TEST PASSED');
})().catch((e) => {
  console.error('UNIT PROTO TEST FAILED:', e.message || e);
  process.exit(1);
});
