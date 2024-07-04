import { HTMLAttributes } from "react";
import classNames from "classnames";

export const SettingsMenuButton = ({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLButtonElement>) => (
  <button className={classNames("btn w-full mb-2", className)} {...props}>
    {children}
  </button>
);
