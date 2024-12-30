import classNames from "classnames";
import { getAnnotation } from "@/features/annotations/annotations.tsx";
import { modalStore } from "@/common/components/Modal/modalStore.tsx";
import { Modal } from "@/common/components/Modal/Modal.tsx";
import { Tooltip } from "@/common/components/Tooltip/Tooltip.tsx";
import type {
  AnnotationSetting} from "@/features/annotations/defs.ts";
import {
  ANNOTATION_SETTINGS,
  isMoveAnnotation,
} from "@/features/annotations/defs.ts";
import { MODAL_IDS } from "@/common/components/Modal/defs.ts";

interface Props {
  disabled?: boolean;
  annotationSetting: AnnotationSetting;
  onSelect: (annotationSetting: AnnotationSetting) => void;
}

export const AnnotationSettings = ({
  disabled,
  annotationSetting,
  onSelect,
}: Props) => {
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
