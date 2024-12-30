import type { HTMLAttributes, ReactNode } from "react";
import classNames from "classnames";

export const SettingsMenuAlert = ({
  title,
  children,
  className,
  ...props
}: Omit<HTMLAttributes<HTMLDivElement>, "title"> & { title: ReactNode }) => (
  <div
    role="alert"
    className={classNames(
      "alert bg-base-300 mb-2 text-center block",
      className,
    )}
    {...props}
  >
    <div className="w-full">
      <h3 className="font-bold text-base">{title}</h3>
      {children}
    </div>
  </div>
);
