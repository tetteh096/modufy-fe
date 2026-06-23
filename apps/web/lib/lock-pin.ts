const PIN_MIN = 4;
const PIN_MAX = 6;

export function normalizePinInput(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, PIN_MAX);
}

export function isValidPin(pin: string): boolean {
  return pin.length >= PIN_MIN && pin.length <= PIN_MAX;
}

export async function hashPin(pin: string): Promise<string> {
  const data = new TextEncoder().encode(pin);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyPin(pin: string, storedHash: string | null): Promise<boolean> {
  if (!storedHash || !isValidPin(pin)) return false;
  const next = await hashPin(pin);
  return next === storedHash;
}

export const LOCK_PIN_LENGTH = { min: PIN_MIN, max: PIN_MAX };
