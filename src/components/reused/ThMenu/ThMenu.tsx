import { ReactNode } from "react";
import "./ThMenu.scss";
import {
  IconButton,
  IconButtonProps,
} from "@/components/reused/IconButton.tsx";
import classNames from "classnames";

export const ThMenu = ({ children }: { children: ReactNode }) => {
  return <div className="th-menu flex">{children}</div>;
};

ThMenu.Container = ({ children }: { children: ReactNode }) => {
  return <div className="flex justify-between pr-6">{children}</div>;
};

ThMenu.Item = ({ children }: { children: ReactNode }) => {
  return (
    <div className="th-menu__item flex items-center gap-2">{children}</div>
  );
};

ThMenu.IconButton = ({ className, children, ...props }: IconButtonProps) => (
  <IconButton
    className={classNames(
      "text-base-content transition-transform hover:scale-125",
      className,
    )}
    {...props}
  >
    {children}
  </IconButton>
);
