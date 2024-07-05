import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import "./Tooltip.scss";

interface TooltipProps {
  align?: "right" | "center";
  tooltip: ReactNode;
  children: ReactNode;
}

export const Tooltip = ({
  align = "center",
  tooltip,
  children,
}: TooltipProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const setCoordsFromRect = useCallback(
    (rect: DOMRect) => {
      const left = align === "center" ? rect.left + rect.width / 2 : rect.left;
      setCoords({ top: rect.top, left });
    },
    [align],
  );

  const openTooltip = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setCoordsFromRect(rect);
    setShowTooltip(true);
  };

  const closeTooltip = () => setShowTooltip(false);

  useEffect(() => {
    if (showTooltip) {
      const handleScroll = () => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        setCoordsFromRect(rect);
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [setCoordsFromRect, showTooltip]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={openTooltip}
      onMouseLeave={closeTooltip}
    >
      {children}
      {showTooltip &&
        ReactDOM.createPortal(
          <div
            className="repertoire-tooltip border border-primary text-xs"
            style={{
              position: "fixed",
              top: coords.top,
              left: coords.left,
              transform:
                align === "center"
                  ? "translate(-50%, -115%)"
                  : "translateY(-115%)",
            }}
          >
            {tooltip}
          </div>,
          document.body,
        )}
    </div>
  );
};

export const withOptionalTooltip = (
  children: ReactNode,
  tooltip?: ReactNode,
) => (tooltip ? <Tooltip tooltip={tooltip}>{children}</Tooltip> : children);
