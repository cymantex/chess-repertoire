import "./annotations.scss";
import { FaChessBoard, FaRegEye } from "react-icons/fa6";
import { IconButton } from "@/common/components/IconButton.tsx";
import type { ButtonHTMLAttributes } from "react";
import classNames from "classnames";
import type {
  MoveAnnotation} from "@/features/annotations/defs.ts";
import {
  ANNOTATION_SETTINGS,
  ANNOTATION_THEME_ATTRIBUTE,
  ANNOTATION_THEMES,
  MOVE_ANNOTATIONS
} from "@/features/annotations/defs.ts";
import { DEFAULT_SETTINGS } from "@/features/repertoire/defs.ts";
import { getRepertoireSettings } from "@/features/repertoire/settings/repertoireSettingsStore.ts";

export const getAnnotation = (annotation?: number) =>
  ANNOTATIONS[annotation as MoveAnnotation];

const createAnnotationButton =
  (icon: string) =>
  ({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button
      className={classNames("annotation-icon__container", className)}
      {...props}
    >
      <div className={`annotation-icon annotation-icon__${icon}`} />
    </button>
  );

const createAnnotationSvg = (icon: string) => `
  <foreignObject width="25" height="25">
    <div 
      class="annotation-icon__container bg-black" 
      style="margin-left: 1px; margin-top: 1px"
    >
      <div class="annotation-icon annotation-icon__${icon}"/>
    </div>
  </foreignObject>
`;

export const loadAnnotationTheme = () => {
  const { annotationTheme } = getRepertoireSettings();

  if (Object.values(ANNOTATION_THEMES).includes(annotationTheme)) {
    document.documentElement.setAttribute(
      ANNOTATION_THEME_ATTRIBUTE,
      annotationTheme,
    );
    import(`@/features/annotations/annotations.${annotationTheme}.css`);
  } else {
    import(
      `@/features/annotations/annotations.${DEFAULT_SETTINGS.annotationTheme}.css`
    );
  }
};

// eslint-disable-next-line react-refresh/only-export-components
const ANNOTATIONS = {
  [ANNOTATION_SETTINGS.BRILLIANT]: {
    id: MOVE_ANNOTATIONS.BRILLIANT,
    AnnotationIconButton: createAnnotationButton("brilliant"),
    svg: createAnnotationSvg("brilliant"),
    displayName: "Brilliant",
  },
  [ANNOTATION_SETTINGS.GOOD]: {
    id: MOVE_ANNOTATIONS.GOOD,
    AnnotationIconButton: createAnnotationButton("good"),
    svg: createAnnotationSvg("good"),
    displayName: "Good",
  },
  [ANNOTATION_SETTINGS.INTERESTING]: {
    id: MOVE_ANNOTATIONS.INTERESTING,
    AnnotationIconButton: createAnnotationButton("interesting"),
    svg: createAnnotationSvg("interesting"),
    displayName: "Interesting",
  },
  [ANNOTATION_SETTINGS.NEUTRAL]: {
    id: MOVE_ANNOTATIONS.NEUTRAL,
    AnnotationIconButton: createAnnotationButton("neutral"),
    svg: createAnnotationSvg("neutral"),
    displayName: "Neutral",
  },
  [ANNOTATION_SETTINGS.DUBIOUS]: {
    id: MOVE_ANNOTATIONS.DUBIOUS,
    AnnotationIconButton: createAnnotationButton("dubious"),
    svg: createAnnotationSvg("dubious"),
    displayName: "Dubious",
  },
  [ANNOTATION_SETTINGS.BAD]: {
    id: MOVE_ANNOTATIONS.BAD,
    AnnotationIconButton: createAnnotationButton("bad"),
    svg: createAnnotationSvg("bad"),
    displayName: "Bad",
  },
  [ANNOTATION_SETTINGS.BLUNDER]: {
    id: MOVE_ANNOTATIONS.BLUNDER,
    AnnotationIconButton: createAnnotationButton("blunder"),
    svg: createAnnotationSvg("blunder"),
    displayName: "Blunder",
  },
  [ANNOTATION_SETTINGS.NONE]: {
    AnnotationIconButton: (props: ButtonHTMLAttributes<HTMLButtonElement>) => (
      <IconButton {...props}>
        <FaChessBoard />
      </IconButton>
    ),
    displayName: "No annotations",
  },
  [ANNOTATION_SETTINGS.DONT_SAVE]: {
    AnnotationIconButton: (props: ButtonHTMLAttributes<HTMLButtonElement>) => (
      <IconButton {...props}>
        <FaRegEye />
      </IconButton>
    ),
    displayName: "View mode: Don't save any moves played on the board",
  },
} as const;

export const MOVE_ANNOTATION_LIST =
  Object.values(MOVE_ANNOTATIONS).map(getAnnotation);
