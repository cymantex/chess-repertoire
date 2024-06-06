import { useRepertoireStore } from "@/store/useRepertoireStore.ts";
import { selectFen } from "@/store/selectors.ts";
import { useDatabasePositionComment } from "@/store/database/hooks.ts";
import { repertoireDatabaseStore } from "@/store/database/repertoireDatabaseStore.ts";

export const CommentTextarea = () => {
  const fen = useRepertoireStore(selectFen);
  const comment = useDatabasePositionComment(fen);

  return (
    <label className="flex mt-3">
      <div className="label mr-2 pr-0">
        <span className="label-text">Comment</span>
      </div>
      <textarea
        rows={3}
        className="textarea textarea-bordered w-full"
        value={comment}
        onChange={(e) =>
          repertoireDatabaseStore.upsertComment(fen, e.target.value)
        }
      />
    </label>
  );
};
