import { SVGProps } from "react";

export const WhitePawn = (props?: SVGProps<SVGSVGElement>) => (
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
      <linearGradient
        id="a"
        x1="4127.3"
        x2="4235.7"
        y1="-2558.4"
        y2="-2558.4"
        gradientTransform="matrix(.27677 0 0 .27555 -1132.3 731.96)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#fff" />
        <stop offset="1" stopColor="#e6e6e6" />
      </linearGradient>
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
    </defs>
    <path
      fill="url(#a)"
      stroke="#000"
      strokeLinecap="square"
      strokeLinejoin="round"
      strokeWidth="1.135"
      d="M25.024 43.401H11.119c-2.551-5.885 4.213-11.341 8.968-13.194-5.682-3.16-2.602-11.219 2.27-11.873-1.16-.763-1.74-2.393-1.74-3.7 0-1.09.463-2.072 1.275-2.834.812-.763 1.856-1.2 3.131-1.2 1.16 0 2.204.437 3.132 1.2.812.762 1.275 1.743 1.275 2.833 0 1.308-.58 2.938-1.74 3.701 5.336 2.07 7.257 9.693 2.27 11.873 6.494 2.289 11.056 8.072 8.968 13.194z"
      className="st31"
      filter="url(#b)"
      transform="matrix(.96658 0 0 .97245 .833 1.243)"
    />
  </svg>
);
