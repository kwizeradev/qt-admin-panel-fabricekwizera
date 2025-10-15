/*
  Unit test: crypto verify should fail for mismatched message or tampered signature.
  Run: node scripts/unit-crypto.js
*/

const crypto = require('node:crypto');

const assert = (cond, msg) => {
  if (!cond) throw new Error(msg);
};

(() => {
  // Generate ephemeral P-384 keypair
  const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', {
    namedCurve: 'secp384r1',
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });

  const email = 'alice@example.com';
  const other = 'bob@example.com';

  const signature = crypto.sign('sha384', Buffer.from(email), {
    key: privateKey,
    format: 'pem',
    type: 'pkcs8',
  });

  // Should verify for the original message
  const ok = crypto.verify('sha384', Buffer.from(email), {
    key: publicKey,
    format: 'pem',
    type: 'spki',
  }, signature);
  assert(ok, 'Expected signature to verify for original message');

  // Should fail for a different message
  const wrong = crypto.verify('sha384', Buffer.from(other), {
    key: publicKey,
    format: 'pem',
    type: 'spki',
  }, signature);
  assert(!wrong, 'Expected verification to fail for mismatched message');

  // Should fail if signature is tampered
  const tampered = Buffer.from(signature);
  tampered[0] = tampered[0] ^ 0xff;
  const bad = crypto.verify('sha384', Buffer.from(email), {
    key: publicKey,
    format: 'pem',
    type: 'spki',
  }, tampered);
  assert(!bad, 'Expected verification to fail for tampered signature');

  console.log('UNIT CRYPTO TEST PASSED');
})();
