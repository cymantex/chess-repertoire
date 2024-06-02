import { useChessRepertoireStore } from "@/store/store.ts";
import { useEffect, useState } from "react";
import {
  getRepertoireComment,
  upsertRepertoireComment,
} from "@/repertoire-database/database.ts";
import { selectFen } from "@/store/selectors.ts";

export const useRepertoireComment = () => {
  const fen = useChessRepertoireStore(selectFen);
  const [comment, setComment] = useState<string>(getRepertoireComment(fen));

  useEffect(() => {
    setComment(getRepertoireComment(fen));
  }, [fen]);

  return {
    comment,
    setComment: (updatedComment: string) => {
      upsertRepertoireComment(fen, updatedComment);
      setComment(updatedComment);
    },
  };
};
