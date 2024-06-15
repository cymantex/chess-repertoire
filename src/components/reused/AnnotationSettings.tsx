import classNames from "classnames";
import { useState } from "react";
import { getAnnotation } from "@/assets/annotation/defs.ts";
import { ANNOTATION_SETTINGS, AnnotationSetting } from "@/repertoire/defs.ts";

interface AnnotationSettingsProps {
  disabled?: boolean;
  annotationSetting: AnnotationSetting;
  onSelect: (annotationSetting: AnnotationSetting) => void;
}

export const AnnotationSettings = ({
  disabled,
  annotationSetting,
  onSelect,
}: AnnotationSettingsProps) => {
  const [showAnnotationMenu, setShowAnnotationMenu] = useState(false);

  const { SettingsIcon } = getAnnotation(annotationSetting);

  return (
    <div
      className={classNames("dropdown md:dropdown-top", {
        "dropdown-open": showAnnotationMenu,
      })}
    >
      <span
        title="Annotation settings"
        onClick={() => {
          if (disabled) return;
          setShowAnnotationMenu(!showAnnotationMenu);
        }}
      >
        <SettingsIcon
          className={classNames("transition-all rounded", {
            "hover:scale-150": !disabled,
            "cursor-pointer": !disabled,
          })}
        />
      </span>
      <div
        className={classNames(
          "dropdown-content p-2 bg-base-100 rounded-box w-64",
          {
            hidden: !showAnnotationMenu,
          },
        )}
      >
        <div role="alert" className="alert shadow-lg mb-2">
          <div>
            <h3 className="font-bold text-base">Annotation settings</h3>
            <div className="text-xs">
              Here you can change how new moves should be annotated in your
              repertoire.
            </div>
          </div>
        </div>
        <ul className="menu p-0">
          {Object.values(ANNOTATION_SETTINGS).map((annotationSetting) => (
            <AnnotationSettingMenuItem
              key={annotationSetting}
              annotationSetting={annotationSetting}
              onClick={() => {
                onSelect(annotationSetting);
                setShowAnnotationMenu(false);
              }}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

const AnnotationSettingMenuItem = ({
  annotationSetting,
  onClick,
}: {
  annotationSetting: AnnotationSetting;
  onClick: () => void;
}) => {
  const { SettingsIcon, displayName } = getAnnotation(annotationSetting);

  return (
    <li>
      <a className="pl-1" onClick={() => onClick()}>
        <SettingsIcon className="text-2xl" /> {displayName}
      </a>
    </li>
  );
};
