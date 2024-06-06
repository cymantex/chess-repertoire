import { FaRotate } from "react-icons/fa6";
import {
  FaFastBackward,
  FaFastForward,
  FaStepBackward,
  FaStepForward,
} from "react-icons/fa";
import { useChessRepertoireStore } from "@/store/store.ts";
import {
  selectGoToFirstMove,
  selectGoToLastMove,
  selectGoToNextMove,
  selectGoToPreviousMove,
  selectRotate,
} from "@/store/selectors.ts";

export const NavigationMenu = () => {
  const rotate = useChessRepertoireStore(selectRotate);
  const goToFirstMove = useChessRepertoireStore(selectGoToFirstMove);
  const goToPreviousMove = useChessRepertoireStore(selectGoToPreviousMove);
  const goToNextMove = useChessRepertoireStore(selectGoToNextMove);
  const goToLastMove = useChessRepertoireStore(selectGoToLastMove);

  return (
    <div className="flex justify-evenly text-2xl pt-3">
      <FaRotate className="cursor-pointer" onClick={rotate} />
      <FaFastBackward className="cursor-pointer" onClick={goToFirstMove} />
      <FaStepBackward className="cursor-pointer" onClick={goToPreviousMove} />
      <FaStepForward className="cursor-pointer" onClick={goToNextMove} />
      <FaFastForward className="cursor-pointer" onClick={goToLastMove} />
    </div>
  );
};
