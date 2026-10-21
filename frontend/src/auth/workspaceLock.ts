let locked = false;
let writes = 0;
let version = 0;
export const workspaceLocked = () => locked;
export const workspaceLockVersion = () => version;
export const pendingWrites = () => writes;
export function setWorkspaceLocked(value: boolean) {
  if (value !== locked) version++;
  locked = value;
  window.dispatchEvent(new Event('mediflow:session-state'));
}
export function trackWrite(delta: number) {
  writes = Math.max(0, writes + delta);
  window.dispatchEvent(new Event('mediflow:session-state'));
}
