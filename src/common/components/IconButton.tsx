import classNames from "classnames";
import { HTMLAttributes } from "react";

export type IconButtonProps = HTMLAttributes<HTMLButtonElement> & {
  disabled?: boolean;
};

export const IconButton = ({
  className,
  disabled,
  children,
  ...props
}: IconButtonProps) => (
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
