import classNames from "classnames";
import type { InputHTMLAttributes, ReactNode } from "react";

interface Props
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "name"> {
  name: ReactNode;
  label: ReactNode;
  onChange: (value: number) => unknown;
}

export const Range = ({
  name,
  label,
  onChange,
  className,
  ...props
}: Props) => (
  <div className={classNames("flex text-sm font-thin items-center", className)}>
    <span className="w-28 mr-2">{name}</span>
    <input
      type="range"
      className="range range-secondary"
      onChange={(e) => onChange(parseInt(e.target.value))}
      {...props}
    />
    <span className="w-16 whitespace-nowrap ml-2">{label}</span>
  </div>
);
