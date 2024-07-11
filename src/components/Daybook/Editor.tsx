import { useEffect, useState } from "react";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { PiNotePencilLight } from "react-icons/pi";
import { AiOutlineDelete } from "react-icons/ai";

import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Confetti from "react-dom-confetti";

import Note from "../../types/Note";

import "./../../App.css";

interface EditorProps {
  displayedNote: Note | null;
  setDisplayedNote: React.Dispatch<React.SetStateAction<Note | null>>;
  createNote: () => Promise<void>;
  removeNote: () => Promise<void>;
  updateNote: (headline: string, content: string) => Promise<void>;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

interface ToolsProps {
  createNote: () => Promise<void>;
  removeNote: () => Promise<void>;
  updateNote: (headline: string, content: string) => Promise<void>;
  displayedNote: Note | null;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

const Tools = ({
  removeNote,
  createNote,
  updateNote,
  displayedNote,
  setSearchQuery,
}: ToolsProps) => {
  const handleCreateNote = async () => {
    try {
      await createNote();
      if (displayedNote) {
        await updateNote(displayedNote.headline, displayedNote.content);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="flex justify-between">
      <div className="flex ml-2">
        <button onClick={handleCreateNote} className="mr-3 bg-transparent">
          <div className="py-4 text-bright-green" style={{ fontSize: "2rem" }}>
            <PiNotePencilLight />
          </div>
        </button>
        <button onClick={removeNote} className="bg-transparent">
          <div className="py-4 text-bright-green" style={{ fontSize: "2rem" }}>
            <AiOutlineDelete />
          </div>
        </button>
      </div>
      <div className="py-4 mr-5 w-1/4">
        <input
          type="text"
          placeholder="Search"
          className="border rounded text- h-8 p-2 w-full bg-transparent"
          onChange={handleSearchChange}
        />
      </div>
    </div>
  );
};

export default function Editor({
  displayedNote,
  setDisplayedNote,
  createNote,
  removeNote,
  updateNote,
  setSearchQuery,
}: EditorProps) {
  const [confetti, setConfetti] = useState(false);
  const [checkedCount, setCheckedCount] = useState(0);

  const headlineEditor = useEditor({
    extensions: [StarterKit, Highlight, Typography],
    content: "",
    editorProps: {
      attributes: {
        class: "prose max-w-none h-full w-full",
      },
    },
    onUpdate: () => {
      let newHeadline = headlineEditor?.getHTML();
      if (newHeadline !== undefined && displayedNote) {
        let cleanedHeadline = newHeadline.replace(/<[^>]*>/g, "");
        const newNote = { ...displayedNote, headline: cleanedHeadline };
        setDisplayedNote(newNote);
      }
    },
  });

  const editor = useEditor({
    extensions: [StarterKit, TaskList, TaskItem, Highlight, Typography],
    content: ``,
    editorProps: {
      attributes: {
        class: "prose max-w-none h-1/2 w-full",
      },
    },
    onUpdate: () => {
      let newContent = editor?.getHTML();
      if (newContent !== undefined && displayedNote) {
        const newNote = { ...displayedNote, content: newContent };
        setDisplayedNote(newNote);
        let newCheckedCount = (
          newContent.match(/<input type="checkbox" checked="checked">/g) || []
        ).length;
        if (newCheckedCount > checkedCount) {
          setConfetti(true);
          setTimeout(() => setConfetti(false), 100);
        }
        setCheckedCount(newCheckedCount);
      }
    },
  });

  useEffect(() => {
    if (displayedNote) {
      let wrappedHeadline = `<h1>${displayedNote.headline}</h1>`;
      headlineEditor?.commands.setContent(wrappedHeadline, false, {
        preserveWhitespace: true,
      });
      editor?.commands.setContent(displayedNote.content, false, {
        preserveWhitespace: true,
      });
    }
  }, [headlineEditor, editor, displayedNote]);

  return (
    <div className="bg-dark-green relative h-screen w-full">
      <div className="relative ">
        <Tools
          createNote={createNote}
          removeNote={removeNote}
          updateNote={updateNote}
          displayedNote={displayedNote}
          setSearchQuery={setSearchQuery}
        />
      </div>
      <div className="headline relative border border-green-900">
        <EditorContent editor={headlineEditor} />
      </div>
      <div className="h-full w-full border border-green-900 overflow-y-auto">
        <EditorContent editor={editor} />
        <Confetti active={confetti} />
      </div>
    </div>
  );
}
