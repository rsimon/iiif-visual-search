import { useState, useEffect, useCallback } from 'react';
import {
  restoreDirectory,
  requestSavedPermission,
  pickAndSaveDirectory,
  clearSavedDirectoryHandle
} from '../lib/fs';

type DirectoryStatus = 'loading' | 'needs-permission' | 'permission-denied' | 'no-handle-stored' | 'ready';

export const useDirectoryHandle = () => {
  const [handle, setHandle] = useState<FileSystemDirectoryHandle | null>(null);
  const [status, setStatus] = useState<DirectoryStatus>('loading');

  useEffect(() => {
    restoreDirectory().then(result => {
      if (result.success) {
        setHandle(result.handle); 
        setStatus('ready'); 
      } else if (result.reason === 'needs-permission') { 
        setStatus('needs-permission');
        setHandle(result.handle);
      } else {
        setStatus(result.reason);
      }
    });
  }, []);

  const pickDirectory = useCallback(async () => {
    const h = await pickAndSaveDirectory();
    setHandle(h); 
    setStatus('ready');
  }, []);

  const grantDirectoryPermission = useCallback(async () => {
    if (!handle) return;

    const success = await requestSavedPermission(handle);
    if (success) { 
      setStatus('ready'); 
    } else { 
      setStatus('no-handle-stored'); 
    }
  }, [handle]);

  const clearDirectory = useCallback(async () => {
    await clearSavedDirectoryHandle();
    setHandle(null); 
    setStatus('no-handle-stored');
  }, []);

  return { handle, status, pickDirectory, grantDirectoryPermission, clearDirectory };
}