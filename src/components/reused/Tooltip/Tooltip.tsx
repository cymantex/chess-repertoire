import {
  ReactNode,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import ReactDOM from "react-dom";
import "./Tooltip.scss";
import classNames from "classnames";

interface TooltipProps {
  align?: "right" | "center";
  className?: string;
  renderTooltip?: () => ReactNode;
  tooltip?: ReactNode;
  children: ReactNode;
}

export const Tooltip = ({
  align = "center",
  className,
  renderTooltip,
  tooltip,
  children,
}: TooltipProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [coords, setCoords] = useState({
    top: 0,
    left: 0,
    transform: "none",
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const setTooltipCoords = useCallback(
    (rect: DOMRect, tooltip: HTMLDivElement) => {
      if (align === "center") {
        setCoords(calcAlignCenterCoords(rect, tooltip));
        return;
      }

      setCoords(calcAlignRightCoords(rect, tooltip));
    },
    [align],
  );

  const openTooltip = () => setShowTooltip(true);
  const closeTooltip = () => setShowTooltip(false);

  useLayoutEffect(() => {
    if (showTooltip) {
      if (containerRef.current && tooltipRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setTooltipCoords(rect, tooltipRef.current);
      }

      const handleScroll = () => {
        if (!containerRef.current || !tooltipRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        setTooltipCoords(rect, tooltipRef.current);
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [setTooltipCoords, showTooltip]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={openTooltip}
      onMouseLeave={closeTooltip}
      onTouchStart={openTooltip}
      onTouchEnd={closeTooltip}
    >
      {children}
      {showTooltip &&
        ReactDOM.createPortal(
          <div
            ref={tooltipRef}
            className={classNames(
              "repertoire-tooltip border border-primary text-xs",
              className,
            )}
            style={{
              position: "fixed",
              top: coords.top,
              left: coords.left,
              transform: coords.transform,
            }}
          >
            {renderTooltip ? renderTooltip() : tooltip}
          </div>,
          document.body,
        )}
    </div>
  );
};

const MARGIN = 10;

const calcAlignCenterCoords = (rect: DOMRect, tooltip: HTMLDivElement) => {
  let left = rect.left + rect.width / 2;
  let top = rect.top - MARGIN;
  let transform = "translate(-50%, -100%)";
  const tooltipWidth = tooltip.offsetWidth / 2;
  const tooltipHeight = tooltip.offsetHeight;

  if (left + tooltipWidth > window.innerWidth) {
    left = window.innerWidth - tooltipWidth;
  }

  if (left - tooltipWidth < 0) {
    left = tooltipWidth + MARGIN * 2;
  }

  if (top - tooltipHeight < 0) {
    top = top + rect.height + MARGIN * 2;
    transform = "translateX(-50%)";
  }
  return { left, top, transform };
};

const calcAlignRightCoords = (rect: DOMRect, tooltip: HTMLDivElement) => {
  let left = rect.left;
  let top = rect.top - MARGIN;
  let transform = "translateY(-100%)";
  const tooltipWidth = tooltip.offsetWidth;
  const tooltipHeight = tooltip.offsetHeight;

  if (left + tooltipWidth > window.innerWidth) {
    left = window.innerWidth - tooltipWidth;
  }

  if (left - tooltipWidth < 0) {
    left = tooltipWidth + MARGIN * 2;
  }

  if (top - tooltipHeight < 0) {
    top = top + rect.height + MARGIN * 2;
    transform = "none";
  }

  return { left, top, transform };
};
