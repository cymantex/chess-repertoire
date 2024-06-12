import {
  AnnotationProps,
  DEFAULT_ANNOTATION_STYLES,
} from "@/assets/annotation/defs.ts";

export const NeutralIcon = ({
  backgroundProps,
  ...props
}: Omit<AnnotationProps, "shapeProps">) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 18 19"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g>
      <path
        d="M9,0a9,9,0,1,0,9,9A9,9,0,0,0,9,0Z"
        style={DEFAULT_ANNOTATION_STYLES.background}
        {...backgroundProps}
      />
      <g opacity="0.2" />
      <g />
    </g>
  </svg>
);
