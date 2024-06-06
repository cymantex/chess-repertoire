import { FaRotate } from "react-icons/fa6";
import {
  FaFastBackward,
  FaFastForward,
  FaStepBackward,
  FaStepForward,
} from "react-icons/fa";
import { useRepertoireStore } from "@/store/useRepertoireStore.ts";
import {
  selectGoToFirstMove,
  selectGoToLastMove,
  selectGoToNextMove,
  selectGoToPreviousMove,
  selectRotate,
} from "@/store/selectors.ts";

export const NavigationMenu = () => {
  const rotate = useRepertoireStore(selectRotate);
  const goToFirstMove = useRepertoireStore(selectGoToFirstMove);
  const goToPreviousMove = useRepertoireStore(selectGoToPreviousMove);
  const goToNextMove = useRepertoireStore(selectGoToNextMove);
  const goToLastMove = useRepertoireStore(selectGoToLastMove);

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
