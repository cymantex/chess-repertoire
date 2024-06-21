import { ReactNode } from "react";

export const HideOnMobile = ({ children }: { children: ReactNode }) => (
  <div className="hidden md:block">{children}</div>
);
