import { SVGProps } from "react";

export const WhiteQueen = (props?: SVGProps<SVGSVGElement>) => (
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
        x1="-71.638"
        x2="-30.679"
        y1="-83.324"
        y2="-83.324"
        gradientTransform="matrix(.97643 0 0 .99287 74.952 107.73)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#fff" />
        <stop offset="1" stopColor="#e6e6e6" />
      </linearGradient>
    </defs>
    <path
      fill="url(#a)"
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.1"
      d="M24.994 6.549v0c-1.568.006-2.835 1.181-2.836 2.63.002 1.193.873 2.235 2.122 2.539-.688 4.45-1.967 9.726-2.634 14.112l-4.07-12.927c.968-.444 1.58-1.356 1.58-2.354 0-1.452-1.275-2.63-2.847-2.63-1.572.001-2.847 1.178-2.847 2.63.002 1.206.89 2.256 2.157 2.548l-.44 13.258-5.482-10.611c.951-.45 1.55-1.354 1.55-2.34 0-1.453-1.275-2.63-2.847-2.63-1.573 0-2.847 1.177-2.847 2.63 0 1.334 1.084 2.456 2.519 2.61l2.76 16.507 4.05 5.258-1.005 3.634c-.042.656 4.849 2.027 11.122 2.04 6.274-.013 11.164-1.384 11.122-2.04l-1.004-3.634 4.05-5.258 2.76-16.507c1.435-.154 2.518-1.276 2.52-2.61 0-1.453-1.275-2.63-2.848-2.63-1.572 0-2.846 1.177-2.846 2.63 0 .986.598 1.89 1.55 2.34l-5.484 10.61-.439-13.257c1.266-.292 2.155-1.342 2.157-2.548 0-1.452-1.275-2.63-2.847-2.63-1.572.001-2.847 1.178-2.847 2.63 0 .998.612 1.91 1.58 2.354l-4.07 12.927c-.668-4.386-1.946-9.663-2.635-14.112 1.25-.304 2.121-1.346 2.123-2.54 0-1.448-1.268-2.623-2.836-2.629v0h-.011z"
      filter="url(#b)"
      style={{ paintOrder: "normal" }}
    />
    <ellipse
      cx="4708.7"
      cy="-2517.6"
      className="st15"
      filter="url(#c)"
      rx="32.126"
      ry="2.844"
      transform="matrix(.25939 0 0 .29298 -1196.4 778.12)"
    />
    <path
      fill="none"
      stroke="#000"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M15.172 34.076s2.7-1.249 9.802-1.256c7.103-.01 9.8 1.256 9.8 1.256"
      style={{ paintOrder: "stroke fill markers" }}
    />
  </svg>
);
