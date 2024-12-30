import { AxiosError } from "axios";
import { ReactNode } from "react";

interface Props {
  error: AxiosError;
  notFoundErrorMessage?: ReactNode;
}

export const ApiError = ({ error, notFoundErrorMessage }: Props) => {
  if (error.response && error.response.status === 404) {
    return <span>{notFoundErrorMessage}</span>;
  }

  return <span>An unexpected error has occurred: {error.message}</span>;
};
