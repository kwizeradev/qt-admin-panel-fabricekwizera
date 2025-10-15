import { User } from '../types';

const importPublicKey = async (pemKey: string): Promise<CryptoKey> => {
  try {
    const pemContents = pemKey
      .replace('-----BEGIN PUBLIC KEY-----', '')
      .replace('-----END PUBLIC KEY-----', '')
      .replace(/\s/g, '');

    const binaryDer = atob(pemContents);
    const bytes = new Uint8Array(binaryDer.length);
    for (let i = 0; i < binaryDer.length; i++) {
      bytes[i] = binaryDer.charCodeAt(i);
    }

    const key = await window.crypto.subtle.importKey(
      'spki',
      bytes.buffer,
      {
        name: 'ECDSA',
        namedCurve: 'P-384',
      },
      false,
      ['verify']
    );

    return key;
  } catch (error) {
    console.error('Error importing public key:', error);
    throw new Error('Failed to import public key');
  }
};

const hashEmail = async (email: string): Promise<ArrayBuffer> => {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(email);
    const hash = await window.crypto.subtle.digest('SHA-384', data);
    return hash;
  } catch (error) {
    console.error('Error hashing email:', error);
    throw new Error('Failed to hash email');
  }
};

const hexToUint8Array = (hexString: string): Uint8Array => {
  const bytes = new Uint8Array(hexString.length / 2);
  for (let i = 0; i < hexString.length; i += 2) {
    bytes[i / 2] = parseInt(hexString.substring(i, 2), 16);
  }
  return bytes;
};

export const verifyUserSignature = async (
  user: User,
  publicKeyPem: string
): Promise<boolean> => {
  try {
    const publicKey = await importPublicKey(publicKeyPem);

    const hash = await hashEmail(user.email);

    const signature = hexToUint8Array(user.signature);

    const isValid = await window.crypto.subtle.verify(
      {
        name: 'ECDSA',
        hash: { name: 'SHA-384' },
      },
      publicKey,
      signature.buffer.slice() as ArrayBuffer,
      hash
    );

    if (import.meta.env.DEV) {
      console.log(`Signature verification for ${user.email}:`, isValid ? '✅ Valid' : '❌ Invalid');
    }

    return isValid;
  } catch (error) {
    console.error(`Error verifying signature for ${user.email}:`, error);
    return false;
  }
};
export const verifyAndFilterUsers = async (
  users: User[],
  publicKeyPem: string
): Promise<User[]> => {
  try {
    const verificationResults = await Promise.all(
      users.map(async (user) => {
        const isValid = await verifyUserSignature(user, publicKeyPem);
        return { user, isValid };
      })
    );

    const validUsers = verificationResults
      .filter((result) => result.isValid)
      .map((result) => result.user);

    const invalidCount = users.length - validUsers.length;
    
    if (invalidCount > 0 && import.meta.env.DEV) {
      console.warn(`Filtered out ${invalidCount} user(s) with invalid signatures`);
    }

    if (import.meta.env.DEV) {
      console.log(`${validUsers.length} user(s) verified successfully`);
    }

    return validUsers;
  } catch (error) {
    console.error('Error verifying users:', error);
    throw new Error('Failed to verify user signatures');
  }
};