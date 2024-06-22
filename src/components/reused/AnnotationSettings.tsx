import classNames from "classnames";
import { getAnnotation } from "@/assets/annotation/defs.ts";
import { ANNOTATION_SETTINGS, AnnotationSetting } from "@/repertoire/defs.ts";
import { modalStore } from "@/stores/modalStore.tsx";
import { Modal } from "@/components/reused/Modal.tsx";

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
  const { SettingsIcon } = getAnnotation(annotationSetting);

  return (
    <div>
      <span
        title="Annotation settings"
        onClick={() => {
          if (disabled) return;
          modalStore.setModal(
            <AnnotationSettingsModal
              onSelect={(setting) => {
                onSelect(setting);
                modalStore.closeModal();
              }}
            />,
          );
        }}
      >
        <SettingsIcon
          className={classNames("transition-all rounded", {
            "hover:scale-150": !disabled,
            "cursor-pointer": !disabled,
          })}
        />
      </span>
    </div>
  );
};

const AnnotationSettingsModal = ({
  onSelect,
}: {
  onSelect: (setting: AnnotationSetting) => unknown;
}) => (
  <Modal show>
    <Modal.CloseButton onClick={() => modalStore.closeModal()} />
    <Modal.Title>Annotation settings</Modal.Title>
    <div role="alert" className="alert shadow-lg mb-2">
      <div>
        <div className="text-xs">
          Here you can change how new moves should be annotated in your
          repertoire, or if they should added at all.
        </div>
      </div>
    </div>
    <ul className="menu p-0">
      {Object.values(ANNOTATION_SETTINGS).map((annotationSetting) => (
        <AnnotationSettingMenuItem
          key={annotationSetting}
          annotationSetting={annotationSetting}
          onClick={() => onSelect(annotationSetting)}
        />
      ))}
    </ul>
  </Modal>
);

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
