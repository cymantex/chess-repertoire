import { SVGProps } from "react";
import { BrilliantIcon } from "@/assets/annotation/components/BrilliantIcon.tsx";
import { GoodIcon } from "@/assets/annotation/components/GoodIcon.tsx";
import { NeutralIcon } from "@/assets/annotation/components/NeutralIcon.tsx";
import { BadIcon } from "@/assets/annotation/components/BadIcon.tsx";
import { BlunderIcon } from "@/assets/annotation/components/BlunderIcon.tsx";
import BrilliantSvg from "@/assets/annotation/svg/brilliant.svg?raw";
import GoodSvg from "@/assets/annotation/svg/good.svg?raw";
import NeutralSvg from "@/assets/annotation/svg/neutral.svg?raw";
import BadSvg from "@/assets/annotation/svg/bad.svg?raw";
import BlunderSvg from "@/assets/annotation/svg/blunder.svg?raw";
import InterestingSvg from "@/assets/annotation/svg/interesting.svg?raw";
import DubiousSvg from "@/assets/annotation/svg/dubious.svg?raw";
import { InterestingIcon } from "@/assets/annotation/components/InterestingIcon.tsx";
import { DubiousIcon } from "@/assets/annotation/components/DubiousIcon.tsx";
import {
  ANNOTATION_SETTINGS,
  REPERTOIRE_ANNOTATION,
  RepertoireMoveAnnotation,
} from "@/repertoire/defs.ts";
import { FaChessBoard, FaRegEye } from "react-icons/fa6";

export const DEFAULT_ANNOTATION_STYLES = {
  background: {
    fill: "oklch(var(--p))",
  },
  shape: {
    fill: "oklch(var(--pc))",
    strokeWidth: "0.1px",
  },
};

export const ANNOTATION_BACKGROUND_ACTIVE = {
  style: { fill: "oklch(var(--a--dark))" },
};

export const ANNOTATION_SHAPE_ACTIVE = {
  style: {
    fill: "oklch(var(--ac))",
    strokeWidth: "0.1px",
  },
};

export interface AnnotationProps extends SVGProps<SVGSVGElement> {
  backgroundProps?: SVGProps<SVGPathElement>;
  shapeProps?: SVGProps<SVGPathElement>;
}

export const getAnnotation = (annotation?: number) => {
  return ANNOTATIONS[annotation as RepertoireMoveAnnotation];
};

const ANNOTATIONS = {
  [ANNOTATION_SETTINGS.BRILLIANT]: {
    id: REPERTOIRE_ANNOTATION.BRILLIANT,
    SettingsIcon: BrilliantIcon,
    displayName: "Brilliant",
    svg: BrilliantSvg,
    symbol: "!!",
  },
  [ANNOTATION_SETTINGS.GOOD]: {
    id: REPERTOIRE_ANNOTATION.GOOD,
    SettingsIcon: GoodIcon,
    displayName: "Good",
    svg: GoodSvg,
    symbol: "!",
  },
  [ANNOTATION_SETTINGS.INTERESTING]: {
    id: REPERTOIRE_ANNOTATION.INTERESTING,
    SettingsIcon: InterestingIcon,
    displayName: "Interesting",
    svg: InterestingSvg,
    symbol: "!?",
  },
  [ANNOTATION_SETTINGS.NEUTRAL]: {
    id: REPERTOIRE_ANNOTATION.NEUTRAL,
    SettingsIcon: NeutralIcon,
    displayName: "Neutral",
    svg: NeutralSvg,
    symbol: " ",
  },
  [ANNOTATION_SETTINGS.DUBIOUS]: {
    id: REPERTOIRE_ANNOTATION.DUBIOUS,
    SettingsIcon: DubiousIcon,
    displayName: "Dubious",
    svg: DubiousSvg,
    symbol: "?!",
  },
  [ANNOTATION_SETTINGS.BAD]: {
    id: REPERTOIRE_ANNOTATION.BAD,
    SettingsIcon: BadIcon,
    displayName: "Bad",
    svg: BadSvg,
    symbol: "?",
  },
  [ANNOTATION_SETTINGS.BLUNDER]: {
    id: REPERTOIRE_ANNOTATION.BLUNDER,
    SettingsIcon: BlunderIcon,
    displayName: "Blunder",
    svg: BlunderSvg,
    symbol: "??",
  },
  [ANNOTATION_SETTINGS.NONE]: {
    SettingsIcon: FaChessBoard,
    displayName: "No annotations",
    symbol: "",
  },
  [ANNOTATION_SETTINGS.DONT_SAVE]: {
    SettingsIcon: FaRegEye,
    displayName: "View mode: Don't save any moves played on the board",
    symbol: "",
  },
} as const;

export const ANNOTATION_LIST = Object.values(REPERTOIRE_ANNOTATION).map(
  getAnnotation,
);
