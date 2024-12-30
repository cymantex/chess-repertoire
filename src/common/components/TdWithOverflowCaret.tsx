import { ReactNode, useLayoutEffect, useRef, useState } from "react";
import classNames from "classnames";
import { FaCaretDown } from "react-icons/fa6";
import { FaCaretRight } from "react-icons/fa";

export const TdWithOverflowCaret = ({
  children,
  flex,
}: {
  flex?: boolean;
  children: ReactNode;
}) => {
  const [overflowing, setOverflowing] = useState(false);
  const [showOverflow, setShowOverflow] = useState(false);
  const tdRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const tdElement = tdRef.current;
    if (!tdElement) return;
    setOverflowing(tdElement.scrollWidth > tdElement.clientWidth);
  }, [children]);

  return (
    <td className="max-w-1 relative">
      <div
        ref={tdRef}
        className={classNames("overflow-clip", {
          "flex items-center": flex,
          "flex-wrap": flex && showOverflow,
          "whitespace-nowrap": !showOverflow,
        })}
        style={{
          width: `calc(100% - 10px)`,
        }}
      >
        {children}
      </div>
      {(overflowing || showOverflow) && (
        <button
          className="absolute top-3 right-1"
          onClick={() => setShowOverflow((prev) => !prev)}
        >
          {showOverflow ? <FaCaretDown /> : <FaCaretRight />}
        </button>
      )}
    </td>
  );
};
