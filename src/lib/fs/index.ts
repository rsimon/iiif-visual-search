import { saveHandle, loadHandle, clearHandle } from './handle-store';
import { verifyOrRequestPermission, queryPermission } from './permissions';

export const HANDLE_KEY = 'root-dir';

export type RestoreHandleResult =
  | { success: true;  handle: FileSystemDirectoryHandle }
  | { success: false; reason: 'no-handle-stored' }
  | { success: false; reason: 'needs-permission'; handle: FileSystemDirectoryHandle }
  | { success: false; reason: 'permission-denied' }

/**
 * Called on every page load. Returns the handle if permission is already
 * granted, an error + reason otherwise.
 */
export const restoreDirectory = async (): Promise<RestoreHandleResult> => {
  const handle = await loadHandle(HANDLE_KEY);
  if (!handle) return { success: false, reason: 'no-handle-stored' };

  const permission = await queryPermission(handle);
  if (permission === 'granted') return { success: true, handle };
  if (permission === 'denied')  return { success: false, reason: 'permission-denied' };

  return { success: false, reason: 'needs-permission', handle };
}

/** Open the picker and persist the handle. */
export const pickAndSaveDirectory = async (): Promise<FileSystemDirectoryHandle> => {
  const handle = await showDirectoryPicker({ mode: 'readwrite' });
  await saveHandle(HANDLE_KEY, handle);
  return handle;
}

/** Must be called from a user gesture */
export const requestSavedPermission = async (
  handle: FileSystemDirectoryHandle
): Promise<boolean> => {
  return verifyOrRequestPermission(handle);
}

export const clearSavedDirectoryHandle = async (): Promise<void> => clearHandle(HANDLE_KEY);