import { SVGProps } from "react";

export const WhiteRook = (props?: SVGProps<SVGSVGElement>) => (
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
        x1="4501.5"
        x2="4594.6"
        y1="-572.4"
        y2="-572.4"
        gradientTransform="matrix(.34208 0 0 .2837 -1530.8 187.39)"
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
      stroke="#010101"
      strokeWidth="1.144"
      d="M21.932 6.546V9.48h-4.091V6.892h-5.796v7.975l4.533 3.142v12.567l-3.85 2.486v5.213H9.658v5.179h30.682v-5.18h-3.068v-5.212l-3.85-2.486V18.043l4.532-3.211v-7.94h-5.796v2.587h-4.432V6.546H24.83z"
      className="st14"
      filter="url(#b)"
      transform="matrix(1.0055 0 0 .9198 -.137 3.505)"
    />
    <path
      fill="none"
      stroke="#000"
      strokeWidth="1.4"
      d="M18.829 31.438h11.998M18.829 20.006h11.998"
    />
  </svg>
);
