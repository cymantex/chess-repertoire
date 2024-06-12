import classNames from "classnames";
import { useState } from "react";
import { ANNOTATION_SETTINGS, AnnotationSetting } from "@/defs.ts";
import {
  localStorageStore,
  useRepertoireSettings,
} from "@/stores/localStorageStore.ts";
import { ANNOTATIONS } from "@/assets/annotation/defs.ts";

const getAnnotationSettingIcon = (annotationSetting: AnnotationSetting) => {
  if (annotationSetting in ANNOTATIONS) {
    return ANNOTATIONS[annotationSetting];
  }

  throw new Error(`Unknown annotation setting: ${annotationSetting}`);
};

export const AnnotationSettings = () => {
  const [showAnnotationMenu, setShowAnnotationMenu] = useState(false);
  const { annotationSetting } = useRepertoireSettings();

  const { SettingsIcon } = getAnnotationSettingIcon(annotationSetting);

  return (
    <div
      className={classNames("dropdown md:dropdown-top", {
        "dropdown-open": showAnnotationMenu,
      })}
    >
      <span
        title="Annotation settings"
        onClick={() => setShowAnnotationMenu(!showAnnotationMenu)}
      >
        <SettingsIcon className="transition-all hover:scale-150 rounded cursor-pointer" />
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
                localStorageStore.upsertSettings({
                  annotationSetting: annotationSetting,
                });
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
  const { SettingsIcon, displayName } =
    getAnnotationSettingIcon(annotationSetting);

  return (
    <li>
      <a className="pl-1" onClick={() => onClick()}>
        <SettingsIcon className="text-2xl" /> {displayName}
      </a>
    </li>
  );
};
