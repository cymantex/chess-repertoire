import { SVGProps } from "react";

export const WhiteKing = (props?: SVGProps<SVGSVGElement>) => (
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
        <feGaussianBlur in="composite1" result="blur" stdDeviation=".6" />
        <feOffset dx="1.6" dy="1.4" result="offset" />
        <feComposite in="SourceGraphic" in2="offset" result="composite2" />
      </filter>
      <linearGradient
        id="a"
        x1="2986.4"
        x2="3128.4"
        y1="1623.8"
        y2="1623.8"
        gradientTransform="matrix(.27141 0 0 .27218 -804.81 -417.45)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#fff" />
        <stop offset="1" stopColor="#e6e6e6" />
      </linearGradient>
    </defs>
    <path
      fill="url(#a)"
      stroke="#000"
      strokeWidth="1.1"
      d="M23.283 5.55v3.238h-3.364v2.92h3.364v1.758c-3.368 2.127-2.996 5.74-2.996 5.74C9.278 10.69-.385 26.77 12.343 32.26v8.734c0 .95 5.667 2.456 12.657 2.456s12.657-1.506 12.657-2.456V32.26c12.728-5.49 3.066-21.569-7.943-13.053 0 0 .372-3.613-2.996-5.74v-1.758h3.364v-2.92h-3.364V5.551h-1.717z"
      filter="url(#b)"
    />
    <ellipse
      cx="71.077"
      cy="131.54"
      className="st15"
      filter="url(#c)"
      rx="32.126"
      ry="2.844"
      transform="matrix(.28533 0 0 .3223 4.72 -1.98)"
    />
    <path
      fill="none"
      stroke="#000"
      strokeWidth="1.4"
      d="M27.032 30.267c1.49-12.102 11.943-12.441 13.364-7.38 1.42 5.062-4.736 7.38-4.736 7.38s-4.875-.638-10.66-.638-10.66.638-10.66.638-6.156-2.318-4.735-7.38 11.874-4.722 13.364 7.38"
    />
  </svg>
);
