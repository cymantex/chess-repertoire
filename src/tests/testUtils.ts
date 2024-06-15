import { RepertoirePgnPosition } from "@/defs.ts";

export const FEN_E4 =
  "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1";
export const FEN_SICILIAN =
  "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2";
export const FEN_SICILIAN_NF3 =
  "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2";

export const toRepertoireHeader = (
  object: Record<string, RepertoirePgnPosition>,
) =>
  `[Result "*"]\n[Repertoire "${JSON.stringify(object).replaceAll('"', "'")}"]\n\n`;
