import { ReactNode, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import "./Tooltip.scss";

interface TooltipProps {
  tooltip: ReactNode;
  children: ReactNode;
}

export const Tooltip = ({ tooltip, children }: TooltipProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const openTooltip = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setCoords({ top: rect.top, left: rect.left + rect.width / 2 });
    setShowTooltip(true);
  };

  const closeTooltip = () => setShowTooltip(false);

  useEffect(() => {
    if (showTooltip) {
      const handleScroll = () => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        setCoords({ top: rect.top, left: rect.left + rect.width / 2 });
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [showTooltip]);

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
            style={{ position: "fixed", top: coords.top, left: coords.left }}
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
