import { useChessRepertoireStore } from "@/store/store.ts";
import { selectSetFenIfValid } from "@/store/selectors.ts";

export const FenInputField = () => {
  const setFenIfValid = useChessRepertoireStore(selectSetFenIfValid);

  return (
    <label className="flex mt-3">
      <div className="label mr-3 pr-0">
        <span className="label-text">FEN</span>
      </div>
      <input
        type="text"
        placeholder="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        className="input input-bordered w-full"
        onChange={(e) => setFenIfValid(e.target.value)}
      />
    </label>
  );
};
