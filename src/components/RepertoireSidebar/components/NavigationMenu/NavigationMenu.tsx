import { FaRotate } from "react-icons/fa6";
import {
  FaFastBackward,
  FaFastForward,
  FaStepBackward,
  FaStepForward,
} from "react-icons/fa";
import { useRepertoireStore } from "@/store/zustand/useRepertoireStore.ts";
import {
  selectGoToFirstMove,
  selectGoToLastMove,
  selectGoToNextMove,
  selectGoToPreviousMove,
  selectRotate,
} from "@/store/zustand/selectors.ts";
import { PrioritySettings } from "@/components/reused/PrioritySettings.tsx";

export const NavigationMenu = () => {
  const rotate = useRepertoireStore(selectRotate);
  const goToFirstMove = useRepertoireStore(selectGoToFirstMove);
  const goToPreviousMove = useRepertoireStore(selectGoToPreviousMove);
  const goToNextMove = useRepertoireStore(selectGoToNextMove);
  const goToLastMove = useRepertoireStore(selectGoToLastMove);

  return (
    <div className="flex justify-evenly text-2xl">
      <PrioritySettings />
      <FaFastBackward className="cursor-pointer" onClick={goToFirstMove} />
      <FaStepBackward className="cursor-pointer" onClick={goToPreviousMove} />
      <FaStepForward className="cursor-pointer" onClick={goToNextMove} />
      <FaFastForward className="cursor-pointer" onClick={goToLastMove} />
      <FaRotate
        title="Flip board"
        className="cursor-pointer"
        onClick={rotate}
      />
    </div>
  );
};
