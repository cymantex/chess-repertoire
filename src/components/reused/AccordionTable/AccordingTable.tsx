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
  renderTheadTrChildren: (
    toggleButton: ReactNode,
    collapsed: boolean,
  ) => React.ReactNode;
  renderChildren: (collapsed: boolean) => React.ReactNode;
  className?: string;
  section: ToggleSection;
}

export const AccordingTable = ({
  renderTheadTrChildren,
  renderChildren,
  className,
  section,
}: AccordingTableProps) => {
  const { sections } = useRepertoireSettings();
  const collapsed = sections[section] === TOGGLE_STATE.OFF;

  return (
    <table
      className={classNames(
        "accordion-table table table-xs",
        {
          "table--hidden": collapsed,
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
                localStorageStore.upsertSections(
                  section,
                  collapsed ? TOGGLE_STATE.ON : TOGGLE_STATE.OFF,
                )
              }
              style={{
                top: "50%",
                transform: "translateY(-50%)",
              }}
            >
              {collapsed ? <FaCaretDown /> : <FaCaretUp />}
            </button>,
            collapsed,
          )}
        </tr>
      </thead>
      <tbody
        className={classNames({
          hidden: collapsed,
        })}
      >
        {renderChildren(collapsed)}
      </tbody>
    </table>
  );
};
