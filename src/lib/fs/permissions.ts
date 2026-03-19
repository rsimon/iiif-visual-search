export type PermissionState = 'granted' | 'denied' | 'prompt';

export const queryPermission = async (
  handle: FileSystemDirectoryHandle,
  mode: FileSystemPermissionMode = 'readwrite'
): Promise<PermissionState> => handle.queryPermission({ mode });

/** Must be called from a user gesture (click, keydown, etc.) */
export const requestPermission = async (
  handle: FileSystemDirectoryHandle,
  mode: FileSystemPermissionMode = 'readwrite'
): Promise<PermissionState> => handle.requestPermission({ mode });

export const verifyOrRequestPermission = async (
  handle: FileSystemDirectoryHandle,
  mode: FileSystemPermissionMode = 'readwrite'
): Promise<boolean> => {
  const current = await queryPermission(handle, mode);
  if (current === 'granted') return true;
  if (current === 'denied')  return false;
  // 'prompt' — needs a user gesture to proceed
  const result = await requestPermission(handle, mode);
  return result === 'granted';
}