const cryptoApi = () =>
  typeof globalThis.crypto === "undefined" ? undefined : globalThis.crypto;

export const createBrowserId = () => {
  const api = cryptoApi();
  if (typeof api?.randomUUID === "function") {
    try {
      return api.randomUUID();
    } catch {
      // randomUUID is unavailable in some non-secure LAN browser contexts.
    }
  }

  const bytes = new Uint8Array(16);
  try {
    if (api?.getRandomValues) api.getRandomValues(bytes);
    else for (let index = 0; index < bytes.length; index += 1) bytes[index] = Math.floor(Math.random() * 256);
  } catch {
    for (let index = 0; index < bytes.length; index += 1) bytes[index] = Math.floor(Math.random() * 256);
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};

export const fingerprintPayload = async (value: unknown) => {
  const bytes = new TextEncoder().encode(JSON.stringify(value));
  const api = cryptoApi();
  if (api?.subtle?.digest) {
    try {
      const digest = await api.subtle.digest("SHA-256", bytes);
      return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
    } catch {
      // Fall back to a stable non-cryptographic fingerprint for LAN HTTP.
    }
  }

  // Retry matching needs a stable payload fingerprint, not an authentication secret.
  let hash = 0x6c62272e07bb014262b821756295c58dn;
  const prime = 0x0000000001000000000000000000013bn;
  const mask = (1n << 128n) - 1n;
  for (const byte of bytes) {
    hash ^= BigInt(byte);
    hash = (hash * prime) & mask;
  }
  return hash.toString(16).padStart(32, "0");
};
