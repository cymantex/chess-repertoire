import { useChessRepertoireStore } from "@/store/store.ts";
import { selectSetPgnIfValid } from "@/store/selectors.ts";

export const PgnTextarea = () => {
  const setPgnIfValid = useChessRepertoireStore(selectSetPgnIfValid);

  return (
    <label className="flex mt-3">
      <div className="label mr-2 pr-0">
        <span className="label-text">PGN</span>
      </div>
      <textarea
        rows={3}
        className="textarea textarea-bordered w-full"
        onChange={(e) => setPgnIfValid(e.target.value)}
      />
    </label>
  );
};
