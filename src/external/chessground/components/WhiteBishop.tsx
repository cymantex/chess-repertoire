import { SVGProps } from "react";

export const WhiteBishop = (props?: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="25"
    height="25"
    fillRule="evenodd"
    clipRule="evenodd"
    imageRendering="optimizeQuality"
    shapeRendering="geometricPrecision"
    textRendering="geometricPrecision"
    viewBox="0 0 50 50"
    {...props}
  >
    <defs>
      <filter id="c" colorInterpolationFilters="sRGB">
        <feGaussianBlur result="blur" stdDeviation="0.01 0.01" />
      </filter>
      <filter id="b" colorInterpolationFilters="sRGB">
        <feFlood floodColor="#000" floodOpacity=".498" result="flood" />
        <feComposite
          in="flood"
          in2="SourceGraphic"
          operator="in"
          result="composite1"
        />
        <feGaussianBlur in="composite1" result="blur" stdDeviation=".3" />
        <feOffset dx="1" dy="1" result="offset" />
        <feComposite in="SourceGraphic" in2="offset" result="composite2" />
      </filter>
      <linearGradient
        id="a"
        x1="13197"
        x2="13341"
        y1="-9591"
        y2="-9591"
        gradientTransform="translate(-3485.7 2562.6) scale(.26458)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#fff" />
        <stop offset="1" stopColor="#e6e6e6" />
      </linearGradient>
    </defs>
    <path
      fill="url(#a)"
      stroke="#000"
      strokeLinejoin="round"
      strokeWidth="1.1"
      d="M25 6.55c-.878 0-1.654.29-2.261.903-.641.612-.946 1.321-.946 2.159 0 1.225.574 2.127 1.755 2.74-2.969 3.285-8.707 5.821-8.81 10.827.007 2.675 1.466 4.764 3.308 6.8l-1.114 5.833c1.697.542 3.09.942 4.827 1.128-3.882 4.576-10.787-1.74-15.209 2.933l2.33 3.577c5.593-3.962 13.375 3.673 16.12-3.962 2.746 7.635 10.528.003 16.12 3.962l2.33-3.577c-4.422-4.673-11.327 1.643-15.209-2.933 1.738-.186 3.13-.586 4.828-1.128l-1.115-5.833c1.843-2.036 3.302-4.125 3.309-6.8-.103-5.006-5.842-7.542-8.811-10.828 1.181-.612 1.755-1.514 1.755-2.74 0-.837-.304-1.546-.945-2.158-.608-.613-1.384-.903-2.261-.903z"
      filter="url(#b)"
    />
    <ellipse
      cx="2720.3"
      cy="-271.4"
      className="st15"
      filter="url(#c)"
      rx="16.3"
      ry="2.5"
      transform="matrix(.33232 0 0 .24998 -879.01 102.47)"
    />
    <ellipse cx="25" cy="9.611" className="st15" rx="1.14" ry="1.147" />
    <path
      fill="none"
      stroke="#000"
      strokeWidth="1.4"
      d="M21.333 23.266h7.333M25 19.932v6.752"
    />
  </svg>
);
