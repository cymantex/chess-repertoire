import {
  AnnotationProps,
  DEFAULT_ANNOTATION_STYLES,
} from "@/assets/annotation/defs.ts";

export const BadIcon = ({
  shapeProps,
  backgroundProps,
  ...props
}: AnnotationProps) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 18 19"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g transform="matrix(0.9999999999999999, 0, 0, 0.9999999999999999, 0, -3.552713678800501e-15)">
      <path
        d="M9,0a9,9,0,1,0,9,9A9,9,0,0,0,9,0Z"
        style={DEFAULT_ANNOTATION_STYLES.background}
        {...backgroundProps}
      />
      <g opacity="0.2" />
      <g>
        <path
          fill="#fff"
          d="M 10.093 14.193 C 10.102 14.232 10.102 14.273 10.093 14.313 C 10.079 14.355 10.055 14.393 10.023 14.423 L 9.923 14.493 L 9.793 14.493 L 7.873 14.493 C 7.833 14.503 7.792 14.503 7.753 14.493 C 7.714 14.475 7.679 14.447 7.653 14.413 C 7.595 14.354 7.562 14.275 7.563 14.193 L 7.563 12.363 C 7.565 12.278 7.597 12.197 7.653 12.133 L 7.753 12.063 L 7.873 12.063 L 9.763 12.063 C 9.848 12.061 9.931 12.093 9.993 12.153 C 10.023 12.181 10.047 12.215 10.063 12.253 C 10.073 12.296 10.073 12.34 10.063 12.383 L 10.093 14.193 Z M 12.293 7.023 C 12.205 7.281 12.084 7.526 11.933 7.753 C 11.784 7.964 11.62 8.165 11.443 8.353 C 11.283 8.539 11.109 8.713 10.923 8.873 C 10.694 9.071 10.477 9.281 10.273 9.503 C 10.095 9.692 9.999 9.943 10.003 10.203 L 10.003 10.423 C 10.014 10.462 10.014 10.504 10.003 10.543 C 9.995 10.582 9.974 10.618 9.943 10.643 C 9.916 10.675 9.882 10.699 9.843 10.713 L 9.723 10.713 L 7.973 10.713 C 7.934 10.725 7.892 10.725 7.853 10.713 C 7.812 10.702 7.777 10.677 7.753 10.643 C 7.716 10.619 7.688 10.584 7.673 10.543 C 7.666 10.503 7.666 10.463 7.673 10.423 L 7.673 10.073 C 7.671 9.788 7.715 9.504 7.803 9.233 C 7.884 9 7.995 8.778 8.133 8.573 C 8.263 8.374 8.414 8.19 8.583 8.023 C 8.743 7.873 8.913 7.733 9.073 7.603 C 9.302 7.402 9.519 7.189 9.723 6.963 C 9.886 6.778 9.975 6.539 9.973 6.293 C 9.976 6.176 9.952 6.059 9.903 5.953 C 9.852 5.844 9.772 5.751 9.673 5.683 C 9.467 5.524 9.213 5.44 8.953 5.443 C 8.782 5.429 8.61 5.443 8.443 5.483 C 8.302 5.533 8.165 5.593 8.033 5.663 C 7.929 5.723 7.832 5.793 7.743 5.873 L 7.633 5.963 C 7.572 5.985 7.507 5.995 7.443 5.993 C 7.342 5.998 7.245 5.953 7.183 5.873 L 6.183 4.663 C 6.081 4.549 6.081 4.377 6.183 4.263 C 6.261 4.183 6.348 4.112 6.443 4.053 C 6.615 3.906 6.803 3.779 7.003 3.673 C 7.291 3.523 7.592 3.399 7.903 3.303 C 8.288 3.182 8.69 3.124 9.093 3.133 C 9.911 3.135 10.709 3.394 11.373 3.873 C 11.692 4.121 11.954 4.435 12.143 4.793 C 12.344 5.193 12.447 5.635 12.443 6.083 C 12.443 6.402 12.393 6.72 12.293 7.023 Z"
          style={DEFAULT_ANNOTATION_STYLES.shape}
          {...shapeProps}
        />
      </g>
    </g>
  </svg>
);