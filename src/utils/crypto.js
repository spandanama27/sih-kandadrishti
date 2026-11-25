// Web Crypto API based SHA-256 hasher and Ed25519 signature simulator
export async function generateSha256(dataString) {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(dataString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  } catch (err) {
    // Fallback pseudo-sha256 if subtle crypto unavailable
    let hash = 0;
    for (let i = 0; i < dataString.length; i++) {
      const char = dataString.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(64, 'a');
  }
}

// Generate Ed25519 simulated hardware enclave signature
export function generateEd25519Signature(hash, officerId, timestamp) {
  const prefix = "ed25519:sig:v2:";
  const payload = `${hash.slice(0, 16)}:${officerId}:${timestamp}`;
  let sig = '';
  const chars = '0123456789abcdef';
  for (let i = 0; i < 64; i++) {
    const index = (payload.charCodeAt(i % payload.length) * (i + 13)) % 16;
    sig += chars[index];
  }
  return prefix + sig;
}

// Generate unique lot UUID
export function generateLotUUID(mandiCode) {
  const randomHex = Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0').toUpperCase();
  const year = new Date().getFullYear();
  return `LOT-${year}-${mandiCode}-${randomHex}`;
}
