import { HTMLAttributes } from "react";
import classNames from "classnames";

interface EditorButtonProps extends HTMLAttributes<HTMLSpanElement> {
  active: boolean;
}

export const EditorButton = ({
  className,
  active,
  ...props
}: EditorButtonProps) => (
  <span
    {...props}
    className={classNames(
      "cursor-pointer",
      {
        "text-base-content": !active,
        "text-primary": active,
      },
      className,
    )}
  />
);
