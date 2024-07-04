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
    autoClose: 4000,
    ...options,
  });

export const openInfoToast = <TData>(
  content: ToastContent<TData>,
  options?: ToastOptions<TData> | undefined,
) =>
  toast.info(content, {
    autoClose: 4000,
    ...options,
  });
