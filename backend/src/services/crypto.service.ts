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
    console.log('Keys directory created');
  }
};

const generateKeypair = (): void => {
  console.log('Generating keypair...');

  const { privateKey: privKey, publicKey: pubKey } = crypto.generateKeyPairSync('ec', {
    namedCurve: 'secp384r1',
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  });

  fs.writeFileSync(PRIVATE_KEY_PATH, privKey);
  fs.writeFileSync(PUBLIC_KEY_PATH, pubKey);

  privateKey = privKey;
  publicKey = pubKey;

  console.log('ECDSA keypair generated and saved');
};

const loadKeypair = (): boolean => {
  try {
    if (fs.existsSync(PRIVATE_KEY_PATH) && fs.existsSync(PUBLIC_KEY_PATH)) {
      privateKey = fs.readFileSync(PRIVATE_KEY_PATH, 'utf-8');
      publicKey = fs.readFileSync(PUBLIC_KEY_PATH, 'utf-8');
      console.log('keypair loaded from files');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error loading keypair:', error);
    return false;
  }
};

export const initializeCrypto = (): void => {
  ensureKeysDirectory();

  if (!loadKeypair()) {
    generateKeypair();
  }
};

export const signEmail = (email: string): string => {
  try {
    const hash = crypto.createHash('sha384').update(email, 'utf-8').digest();

    const signature = crypto.sign(null, hash, {
      key: privateKey,
      format: 'pem',
      type: 'pkcs8',
    });

    return signature.toString('hex');
  } catch (error) {
    console.error('Error signing email:', error);
    throw new Error('Failed to sign email');
  }
};

export const getPublicKey = (): string => {
  return publicKey;
};

// Verify signature : Test
export const verifySignature = (email: string, signature: string): boolean => {
  try {
    const hash = crypto.createHash('sha384').update(email, 'utf-8').digest();
    const signatureBuffer = Buffer.from(signature, 'hex');

    const isValid = crypto.verify(
      null,
      hash,
      {
        key: publicKey,
        format: 'pem',
        type: 'spki',
      },
      signatureBuffer
    );

    return isValid;
  } catch (error) {
    console.error('Error verifying signature:', error);
    return false;
  }
};