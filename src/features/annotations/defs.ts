export const MOVE_ANNOTATIONS = {
  BRILLIANT: 100,
  GOOD: 200,
  INTERESTING: 300,
  DUBIOUS: 400,
  BAD: 500,
  BLUNDER: 600,
  NEUTRAL: 700,
} as const;
export type MoveAnnotation =
  (typeof MOVE_ANNOTATIONS)[keyof typeof MOVE_ANNOTATIONS];
export const isMoveAnnotation = (
  annotation?: number,
): annotation is MoveAnnotation =>
  Object.values(MOVE_ANNOTATIONS).includes(annotation as MoveAnnotation);

export const ANNOTATION_SETTING_NONE = 1000;
export const ANNOTATION_SETTING_DONT_SAVE = 10000;
export const ANNOTATION_SETTINGS = {
  ...MOVE_ANNOTATIONS,
  NONE: ANNOTATION_SETTING_NONE,
  DONT_SAVE: ANNOTATION_SETTING_DONT_SAVE,
} as const;
export type AnnotationSetting =
  (typeof ANNOTATION_SETTINGS)[keyof typeof ANNOTATION_SETTINGS];

export const ANNOTATION_THEME_ATTRIBUTE = "data-annotation-theme";
export const ANNOTATION_THEMES = {
  DEFAULT: "default",
  PIECES: "pieces",
  DICE: "dice",
} as const;
export type AnnotationTheme =
  (typeof ANNOTATION_THEMES)[keyof typeof ANNOTATION_THEMES];
