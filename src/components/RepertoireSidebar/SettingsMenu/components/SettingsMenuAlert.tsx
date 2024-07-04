import { HTMLAttributes } from "react";
import classNames from "classnames";

export const SettingsMenuAlert = ({
  title,
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { title: string }) => (
  <div
    role="alert"
    className={classNames(
      "alert bg-base-300 mb-2 text-center block",
      className,
    )}
    {...props}
  >
    <div>
      <h3 className="font-bold text-base">{title}</h3>
      {children}
    </div>
  </div>
);
