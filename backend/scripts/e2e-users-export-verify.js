/*
  End-to-end users export + signature verification.
  Steps:
  1) Create a unique user
  2) Fetch public key
  3) Download protobuf export and decode
  4) Verify signature for created user
  5) Cleanup user

  Usage:
    E2E_API_URL=http://localhost:3000 node scripts/e2e-users-export-verify.js
*/

const crypto = require('node:crypto');
const path = require('node:path');
const protobuf = require('protobufjs');

const API = process.env.E2E_API_URL || process.env.SMOKE_API_URL || 'http://localhost:3000';

const httpJson = async (url, options = {}) => {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
};

const httpBuffer = async (url, options = {}) => {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return Buffer.from(await res.arrayBuffer());
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const email = `e2e+${Date.now()}@example.com`;
  const role = 'user';
  const status = 'active';

  // 1) Create user
  const created = await httpJson(`${API}/api/users`, {
    method: 'POST',
    body: JSON.stringify({ email, role, status }),
  });
  if (!created.success || !created.data) throw new Error('Create user failed');
  const userId = created.data.id;

  // 2) Public key
  const pub = await httpJson(`${API}/api/public-key`);
  if (!pub.success || !pub.data || !pub.data.publicKey) throw new Error('Public key fetch failed');
  const publicKeyPem = pub.data.publicKey;

  // Small delay to ensure export sees the row
  await sleep(100);

  // 3) Protobuf export
  const pb = await httpBuffer(`${API}/api/users/export`, {
    headers: { Accept: 'application/x-protobuf' },
  });

  // 3a) Decode
  const protoPath = path.join(__dirname, '..', 'src', 'proto', 'user.proto');
  const root = await protobuf.load(protoPath);
  const UserList = root.lookupType('UserList');
  const message = UserList.decode(pb);
  const obj = UserList.toObject(message, { longs: Number, enums: String, bytes: String });
  const users = obj.users || [];

  const createdUser = users.find((u) => u.email === email);
  if (!createdUser) throw new Error('Created user not present in export');

  // 4) Verify signature
  const ok = crypto.verify(
    'sha384',
    Buffer.from(email, 'utf-8'),
    {
      key: publicKeyPem,
      format: 'pem',
      type: 'spki',
    },
    Buffer.from(createdUser.signature, 'hex')
  );
  if (!ok) throw new Error('Signature verification failed');

  // 5) Cleanup
  await httpJson(`${API}/api/users/${userId}`, { method: 'DELETE' });

  console.log('E2E TEST PASSED');
  process.exit(0);
})().catch((err) => {
  console.error('E2E TEST FAILED:', err.message || err);
  process.exit(1);
});
