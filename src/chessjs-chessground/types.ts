import { COLUMN_NUMBERS } from "@/chessjs-chessground/constants.ts";

export type Column = keyof typeof COLUMN_NUMBERS;
export type CgColor = "white" | "black";
