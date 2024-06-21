import { FaCaretDown, FaCaretUp } from "react-icons/fa6";
import { ReactNode } from "react";
import classNames from "classnames";
import "./AccordionTable.scss";
import { TOGGLE_STATE, ToggleSection } from "@/repertoire/defs.ts";
import {
  localStorageStore,
  useRepertoireSettings,
} from "@/stores/localStorageStore.ts";

interface AccordingTableProps {
  renderTheadTrChildren: (toggleButton: ReactNode) => React.ReactNode;
  children: React.ReactNode;
  className?: string;
  section: ToggleSection;
}

export const AccordingTable = ({
  renderTheadTrChildren,
  children,
  className,
  section,
}: AccordingTableProps) => {
  const { closedSections } = useRepertoireSettings();
  const showBody = closedSections[section] === TOGGLE_STATE.ON;

  return (
    <div>
      <table
        className={classNames(
          "accordion-table table table-xs",
          {
            "table--hidden": !showBody,
          },
          className,
        )}
      >
        <thead className="pt-2 pb-2">
          <tr className="relative">
            {renderTheadTrChildren(
              <button
                className="absolute right-1 text-lg"
                onClick={() =>
                  localStorageStore.upsertClosedSections(
                    section,
                    showBody ? TOGGLE_STATE.OFF : TOGGLE_STATE.ON,
                  )
                }
                style={{
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                {showBody ? <FaCaretUp /> : <FaCaretDown />}
              </button>,
            )}
          </tr>
        </thead>
        <tbody
          className={classNames({
            hidden: !showBody,
          })}
        >
          {children}
        </tbody>
      </table>
    </div>
  );
};
