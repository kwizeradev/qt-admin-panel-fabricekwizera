import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const KEYS_DIR = path.join(__dirname, '../../keys');
const PRIVATE_KEY_PATH = path.join(KEYS_DIR, 'private.pem');
const PUBLIC_KEY_PATH = path.join(KEYS_DIR, 'public.pem');

let privateKey: string;
let publicKey: string;

const ensureKeysDirectory = (): void => {
  if (!fs.existsSync(KEYS_DIR)) {
    fs.mkdirSync(KEYS_DIR, { recursive: true });
  }
};

const generateKeypair = (): void => {
  process.nextTick(() => {
    crypto.generateKeyPair('ec', {
      namedCurve: 'secp384r1',
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    }, (err, pubKey, privKey) => {
      if (err) {
        console.error('Key generation failed:', err);
        return;
      }

      try {
        fs.writeFileSync(PRIVATE_KEY_PATH, privKey, { mode: 0o600 });
        fs.writeFileSync(PUBLIC_KEY_PATH, pubKey, { mode: 0o600 });

        privateKey = privKey;
        publicKey = pubKey;
      } catch (writeErr) {
        console.error('Key write failed:', writeErr);
      }
    });
  });
};

const loadKeypair = (): boolean => {
  try {
    if (fs.existsSync(PRIVATE_KEY_PATH) && fs.existsSync(PUBLIC_KEY_PATH)) {
      privateKey = fs.readFileSync(PRIVATE_KEY_PATH, 'utf-8');
      publicKey = fs.readFileSync(PUBLIC_KEY_PATH, 'utf-8');
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

export const initializeCrypto = (): void => {
  ensureKeysDirectory();

  try {
    if (!loadKeypair()) {
      generateKeypair();
    }
  } catch (err) {
    console.error('Crypto init failed:', err);
    generateKeypair();
  }
};

export const signEmail = (email: string): string => {
  try {
    const emailBuffer = Buffer.from(email, 'utf-8');
    const signature = crypto.sign('sha384', emailBuffer, {
      key: privateKey,
      format: 'pem',
      type: 'pkcs8',
    });

    return signature.toString('hex');
  } catch (error) {
    throw new Error('Failed to sign email');
  }
};

export const getPublicKey = (): string => {
  return publicKey;
};

export const verifySignature = (email: string, signature: string): boolean => {
  try {
    const emailBuffer = Buffer.from(email, 'utf-8');
    const signatureBuffer = Buffer.from(signature, 'hex');

    const isValid = crypto.verify(
      'sha384',
      emailBuffer,
      {
        key: publicKey,
        format: 'pem',
        type: 'spki',
      },
      signatureBuffer
    );

    return isValid;
  } catch (error) {
    return false;
  }
};