import classNames from "classnames";
import { getAnnotation } from "@/assets/annotation/defs.ts";
import { ANNOTATION_SETTINGS, AnnotationSetting } from "@/repertoire/defs.ts";
import { modalStore } from "@/stores/modalStore.tsx";
import { Modal } from "@/components/reused/Modal/Modal.tsx";
import { MODAL_IDS } from "@/defs.ts";

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
              id={MODAL_IDS.ANNOTATION_SETTINGS}
              onSelect={(setting) => {
                onSelect(setting);
                modalStore.closeModal(MODAL_IDS.ANNOTATION_SETTINGS);
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
  id,
  onSelect,
}: {
  id: string;
  onSelect: (setting: AnnotationSetting) => unknown;
}) => (
  <Modal id={id} show>
    <Modal.CloseButton onClick={() => modalStore.closeModal(id)} />
    <Modal.Title>New move settings</Modal.Title>
    <div role="alert" className="alert shadow-lg mb-2">
      <div>
        <div className="text-xs">
          Here you can change if new moves should be added to your repertoire
          and what annotation they should have.
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
