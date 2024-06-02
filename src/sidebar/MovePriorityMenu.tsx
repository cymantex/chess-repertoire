import {
  FaChessBishop,
  FaChessKing,
  FaChessPawn,
  FaChessQueen,
  FaChessRook,
} from "react-icons/fa6";

export const MovePriorityMenu = () => {
  return (
    <div className="flex gap-2 text-base">
      <FaChessKing />
      <FaChessQueen />
      <FaChessRook />
      <FaChessBishop />
      <FaChessPawn />
    </div>
  );
};
