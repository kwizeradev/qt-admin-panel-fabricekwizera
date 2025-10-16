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


const hexToUint8Array = (hexString: string): Uint8Array => {
  const bytes = new Uint8Array(hexString.length / 2);
  for (let i = 0; i < hexString.length; i += 2) {
    bytes[i / 2] = parseInt(hexString.substring(i, i + 2), 16);
  }
  return bytes;
};

const derToRaw = (derSignature: Uint8Array): Uint8Array => {
  try {
    let offset = 0;
    
    if (derSignature[offset++] !== 0x30) throw new Error('Invalid DER signature');
    
    const length = derSignature[offset++];
    if (length & 0x80) {
      const lengthBytes = length & 0x7f;
      offset += lengthBytes;
    }
    
    if (derSignature[offset++] !== 0x02) throw new Error('Invalid DER signature');
    let rLength = derSignature[offset++];
    if (rLength & 0x80) {
      const lengthBytes = rLength & 0x7f;
      rLength = 0;
      for (let i = 0; i < lengthBytes; i++) {
        rLength = (rLength << 8) + derSignature[offset++];
      }
    }
    
    let rStart = offset;
    if (derSignature[rStart] === 0x00) {
      rStart++;
      rLength--;
    }
    const r = derSignature.slice(rStart, rStart + rLength);
    offset = rStart + rLength;
    
    if (derSignature[offset++] !== 0x02) throw new Error('Invalid DER signature');
    let sLength = derSignature[offset++];
    if (sLength & 0x80) {
      const lengthBytes = sLength & 0x7f;
      sLength = 0;
      for (let i = 0; i < lengthBytes; i++) {
        sLength = (sLength << 8) + derSignature[offset++];
      }
    }
    
    let sStart = offset;
    if (derSignature[sStart] === 0x00) {
      sStart++;
      sLength--;
    }
    const s = derSignature.slice(sStart, sStart + sLength);
    
    const coordSize = 48;
    const rawSignature = new Uint8Array(coordSize * 2);
    
    rawSignature.set(r, coordSize - r.length);
    rawSignature.set(s, coordSize * 2 - s.length);
    
    return rawSignature;
  } catch (error) {
    console.error('Error converting DER to raw signature:', error);
    throw error;
  }
};

export const verifyUserSignature = async (
  user: User,
  publicKeyPem: string
): Promise<boolean> => {
  try {
    const publicKey = await importPublicKey(publicKeyPem);
    const encoder = new TextEncoder();
    const emailData = encoder.encode(user.email);
    const derSignature = hexToUint8Array(user.signature);
    const rawSignature = derToRaw(derSignature);

    const isValid = await window.crypto.subtle.verify(
      {
        name: 'ECDSA',
        hash: { name: 'SHA-384' },
      },
      publicKey,
      rawSignature.buffer as ArrayBuffer,
      emailData.buffer as ArrayBuffer
    );

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

    return validUsers;
  } catch (error) {
    console.error('Error verifying users:', error);
    throw new Error('Failed to verify user signatures');
  }
};