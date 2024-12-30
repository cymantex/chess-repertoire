import { Transforms } from "slate";
import type { ReactEditor } from "slate-react";
import type { EditorElement} from "../defs.ts";
import { FORMATS } from "../defs.ts";

export const withImages = (editor: ReactEditor) => {
  const { insertData, isVoid } = editor;

  editor.isVoid = (element: EditorElement) => {
    return element.type === FORMATS.IMAGE ? true : isVoid(element);
  };

  editor.insertData = (data) => {
    const { files } = data;

    if (files && files.length > 0) {
      for (const file of files) {
        const reader = new FileReader();
        const [mime] = file.type.split("/");

        if (mime === "image") {
          reader.addEventListener("load", () => {
            const url = reader.result as string;
            insertImage(editor, url);
          });

          reader.readAsDataURL(file);
        }
      }
    } else {
      insertData(data);
    }
  };

  return editor;
};

const insertImage = (editor: ReactEditor, url: string) => {
  const text = { text: "" };
  const image = { type: FORMATS.IMAGE, url, children: [text] };
  Transforms.insertNodes(editor, image);
  Transforms.insertNodes(editor, {
    type: "paragraph",
    children: [{ text: "" }],
  } as EditorElement);
};
