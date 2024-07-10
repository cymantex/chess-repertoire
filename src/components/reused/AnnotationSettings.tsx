import classNames from "classnames";
import { getAnnotation } from "@/annotations/annotations.tsx";
import { modalStore } from "@/stores/modalStore.tsx";
import { Modal } from "@/components/reused/Modal/Modal.tsx";
import { MODAL_IDS } from "@/defs.ts";
import { Tooltip } from "@/components/reused/Tooltip/Tooltip.tsx";
import {
  ANNOTATION_SETTINGS,
  AnnotationSetting,
  isMoveAnnotation,
} from "@/annotations/defs.ts";

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
  const { AnnotationIconButton } = getAnnotation(annotationSetting);

  return (
    <Tooltip
      containerClassName="flex"
      className="w-32 max-w-32"
      tooltip="Annotation settings (hotkeys: 1-9)"
    >
      <AnnotationIconButton
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
        className={classNames("transition-all", {
          "bg-primary": isMoveAnnotation(annotationSetting),
          "hover:scale-150": !disabled,
          "cursor-pointer": !disabled,
        })}
      />
    </Tooltip>
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
  const { AnnotationIconButton, displayName } =
    getAnnotation(annotationSetting);

  return (
    <li>
      <a className="pl-1" onClick={() => onClick()}>
        <AnnotationIconButton
          className={classNames("text-secondary text-2xl", {
            "bg-secondary": isMoveAnnotation(annotationSetting),
          })}
        />{" "}
        {displayName}
      </a>
    </li>
  );
};
