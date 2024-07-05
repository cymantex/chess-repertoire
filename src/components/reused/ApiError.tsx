import { AxiosError } from "axios";
import { ReactNode } from "react";

interface FetchErrorProps {
  error: AxiosError;
  notFoundErrorMessage?: ReactNode;
}

export const ApiError = ({ error, notFoundErrorMessage }: FetchErrorProps) => {
  if (error.response && error.response.status === 404) {
    return <span>{notFoundErrorMessage}</span>;
  }

  return <span>An unexpected error has occurred: {error.message}</span>;
};
