import { ReactNode } from "react";
import classNames from "classnames";

export const HideOnMobile = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => (
  <div className={classNames("hidden md:block", className)}>{children}</div>
);
