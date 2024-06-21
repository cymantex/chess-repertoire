import classNames from "classnames";
import { HTMLAttributes } from "react";

export const IconButton = ({
  className,
  disabled,
  children,
  ...props
}: HTMLAttributes<HTMLButtonElement> & { disabled?: boolean }) => (
  <button
    className={classNames(
      {
        "text-base-300": disabled,
      },
      className,
    )}
    disabled={disabled}
    {...props}
  >
    {children}
  </button>
);
