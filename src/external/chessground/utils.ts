import { chessground } from "@/external/chessground/Chessground.tsx";

export const userSelectionExists = () => chessground?.state?.selected;
