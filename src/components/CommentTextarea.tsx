import { useState } from "react";
import { setRepertoirePositionComment } from "@/repertoire/repertoireRepository.ts";
import { HideOnMobile } from "@/components/reused/HideOnMobile.tsx";

interface CommentTextareaProps {
  fen: string;
  positionComment: string;
}

// TODO: Remove
export const CommentTextarea = ({
  fen,
  positionComment,
}: CommentTextareaProps) => {
  const [comment, setComment] = useState(positionComment);

  return (
    <HideOnMobile>
      <label className="mt-2">
        <div className="label mr-2 pr-0">
          <span className="label-text">Comment</span>
        </div>
        <textarea
          rows={3}
          className="textarea textarea-bordered w-full"
          value={comment}
          onChange={(e) => {
            e.stopPropagation();
            setComment(e.target.value);

            // Deliberately not updating the store here since it could lead
            // to excessive state updates
            return setRepertoirePositionComment(fen, e.target.value);
          }}
        />
      </label>
    </HideOnMobile>
  );
};
