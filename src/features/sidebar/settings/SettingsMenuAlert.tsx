import type { HTMLAttributes, ReactNode } from "react";
import classNames from "classnames";

export const SettingsMenuAlert = ({
  title,
  children,
  className,
  ...props
}: Omit<HTMLAttributes<HTMLDivElement>, "title"> & { title: ReactNode }) => (
  <div
    className={classNames(
      "mb-3 border-b border-base-300 pb-3 text-left",
      className,
    )}
    {...props}
  >
    <div className="w-full">
      <h3 className="text-sm font-semibold">{title}</h3>
      {children}
    </div>
  </div>
);
