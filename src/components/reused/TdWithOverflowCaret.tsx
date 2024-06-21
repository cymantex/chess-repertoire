import { ReactNode, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { FaCaretDown, FaCaretUp } from "react-icons/fa6";

export const TdWithOverflowCaret = ({ children }: { children: ReactNode }) => {
  const [overflowing, setOverflowing] = useState(false);
  const [showOverflow, setShowOverflow] = useState(false);
  const tdRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tdElement = tdRef.current;
    if (!tdElement) return;

    if (tdElement.scrollWidth > tdElement.clientWidth) {
      setOverflowing(true);
    } else {
      setOverflowing(false);
    }
  }, [children]);

  return (
    <td className="max-w-1 relative">
      <div
        ref={tdRef}
        className={classNames("overflow-clip", {
          "whitespace-nowrap": !showOverflow,
          "text-red": overflowing,
        })}
        style={{
          width: "calc(100% - 10px)",
        }}
      >
        {children}
      </div>
      {(overflowing || showOverflow) && (
        <button
          className="absolute top-1 right-0"
          onClick={() => setShowOverflow((prev) => !prev)}
        >
          {showOverflow ? <FaCaretUp /> : <FaCaretDown />}
        </button>
      )}
    </td>
  );
};
