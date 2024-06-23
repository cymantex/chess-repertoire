import { ReactNode } from "react";
import classNames from "classnames";
import { isMobileSize } from "@/utils/utils.ts";

export const HideOnMobile = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => (
  <div className={classNames("hidden md:block", className)}>
    {!isMobileSize() && children}
  </div>
);
