import { useChessRepertoireStore } from "@/store.ts";

export const PgnInputField = () => {
  const { setPgnIfValid } = useChessRepertoireStore();

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
