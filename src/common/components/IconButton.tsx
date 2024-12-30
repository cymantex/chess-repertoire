import classNames from "classnames";
import { HTMLAttributes } from "react";

export type Props = HTMLAttributes<HTMLButtonElement> & {
  disabled?: boolean;
};

export const IconButton = ({
  className,
  disabled,
  children,
  ...props
}: Props) => (
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
