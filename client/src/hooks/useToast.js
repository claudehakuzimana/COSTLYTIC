import { useCallback } from 'react';
import toast from 'react-hot-toast';

export const useToast = () => {
  const success = useCallback((message) => {
    toast.success(message);
  }, []);

  const error = useCallback((message) => {
    toast.error(message);
  }, []);

  const loading = useCallback((message) => {
    return toast.loading(message);
  }, []);

  const dismiss = useCallback((toastId) => {
    toast.dismiss(toastId);
  }, []);

  return { success, error, loading, dismiss };
};
