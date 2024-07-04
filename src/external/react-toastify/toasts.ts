import type { ToastContent, ToastOptions } from "react-toastify";
import { toast } from "react-toastify";

export const openErrorToast = <TData>(
  content: ToastContent<TData>,
  options?: ToastOptions<TData> | undefined,
) => toast.error(content, options);

export const openSuccessToast = <TData>(
  content: ToastContent<TData>,
  options?: ToastOptions<TData> | undefined,
) =>
  toast.success(content, {
    autoClose: 3000,
    ...options,
  });
