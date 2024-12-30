import type { HTMLAttributes } from "react";
import classNames from "classnames";

export interface EditorButtonProps extends HTMLAttributes<HTMLButtonElement> {
  active: boolean;
}

export const EditorButton = ({
  className,
  active,
  ...props
}: EditorButtonProps) => (
  <button
    {...props}
    className={classNames(
      "cursor-pointer",
      {
        "bg-primary": active,
        "text-primary-content": active,
      },
      className,
    )}
  />
);
