import { useRepertoireComment } from "@/repertoire-database/useRepertoireComment.ts";

export const CommentTextarea = () => {
  const { comment, setComment } = useRepertoireComment();

  return (
    <label className="flex mt-3">
      <div className="label mr-2 pr-0">
        <span className="label-text">Comment</span>
      </div>
      <textarea
        rows={3}
        className="textarea textarea-bordered w-full"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
    </label>
  );
};
