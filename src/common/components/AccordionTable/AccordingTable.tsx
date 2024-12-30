import { FaCaretDown } from "react-icons/fa6";
import type { ReactNode } from "react";
import type React from "react";
import classNames from "classnames";
import "./AccordionTable.scss";
import type { ToggleSection } from "@/features/repertoire/defs.ts";
import { TOGGLE_STATE } from "@/features/repertoire/defs.ts";
import {
  repertoireSettingsStore,
  useRepertoireSettings,
} from "@/features/repertoire/settings/repertoireSettingsStore.ts";
import { FaCaretRight } from "react-icons/fa";

interface Props {
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
}: Props) => {
  const { sections } = useRepertoireSettings();
  const collapsed = sections[section] === TOGGLE_STATE.OFF;

  return (
    <table
      className={classNames(
        "accordion-table table",
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
                repertoireSettingsStore.upsertSections(
                  section,
                  collapsed ? TOGGLE_STATE.ON : TOGGLE_STATE.OFF,
                )
              }
              style={{
                top: "50%",
                transform: "translateY(-50%)",
              }}
            >
              {collapsed ? <FaCaretRight /> : <FaCaretDown />}
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
