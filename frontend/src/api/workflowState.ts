import { createBrowserId } from "../utils/browserCrypto";

export const workflowClientId = createBrowserId();
let lease: string | null = null;
let ready: Promise<boolean> = Promise.resolve(true);
let resolveReady: ((value: boolean) => void) | null = null;
export const workflowLeaseToken = () => lease;
export const waitForWorkflow = () => ready;
export const beginWorkflowClaim = () => { lease = null; ready = new Promise(resolve => { resolveReady = resolve; }); };
export const denyWorkflowClaim = () => { resolveReady?.(false); resolveReady = null; ready = Promise.resolve(false); };
export const setWorkflowLeaseToken = (value: string | null) => { lease = value; resolveReady?.(Boolean(value)); resolveReady = null; ready = Promise.resolve(true); };
