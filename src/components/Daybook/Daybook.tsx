import useNotes from "./../../hooks/useNotes";
import Sidebar from "./Sidebar";
import Editor from "./Editor";

export default function Daybook() {
  const {
    fetchNotes,
    createNote,
    removeNote,
    updateNote,
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
    allNotes,
    setAllNotes,
    displayedNote,
    setDisplayedNote,
  } = useNotes();

  return (
    <div className="flex flex-row h-full">
      <div className="flex w-1/5 h-full overflow-hidden">
        <Sidebar
          searchResults={searchResults}
          allNotes={allNotes}
          setDisplayedNote={setDisplayedNote}
        />
      </div>
      <div className="flex w-4/5 overflow-y-auto bg-dark-green">
        <Editor
          displayedNote={displayedNote}
          updateNote={updateNote}
          createNote={createNote}
          removeNote={removeNote}
        />
      </div>
    </div>
  );
}
