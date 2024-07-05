import type { ToastContent, ToastOptions } from "react-toastify";
import { toast } from "react-toastify";

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

export const openErrorToast = <TData>(
  content: ToastContent<TData>,
  options?: ToastOptions<TData> | undefined,
) => toast.error(content, options);

export const openDefaultErrorToast = (error: unknown) => {
  const errorMessage =
    getErrorMessage(error) ?? "An unexpected error has occurred";
  openErrorToast(errorMessage);
};

export const getErrorMessage = (error: unknown) => {
  console.error(error);

  if (error && typeof error === "object" && Object.hasOwn(error, "message")) {
    // @ts-ignore
    return error.message;
  }

  return null;
};
