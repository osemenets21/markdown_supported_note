import "bootstrap/dist/css/bootstrap.min.css";
import { Navigate, Route, Routes } from "react-router-dom";
import { Container } from "react-bootstrap";
import { NewNote } from "./NewNote";
import { useEffect, useMemo, useState } from "react";
import { v4 as uuidV4 } from "uuid";
import { NoteList } from "./NoteList";
import { NoteLayout } from "./NoteLayout";
import { NoteComponent } from "./Note";
import { EditNote } from "./EditNote";
import { fetchNotes, createNote, updateNote, deleteNote, createTag, updateTag as updateTagApi, deleteTag as deleteTagApi } from "./api";

export type Note = {
  id: string;
} & NoteData;

export type RawNote = {
  id: string;
} & RawNoteData;

export type RawNoteData = {
  title: string;
  markdown: string;
  tagIds: string[];
};

export type NoteData = {
  title: string;
  markdown: string;
  tags: Tag[];
};

export type Tag = {
  id: string;
  label: string;
};

function App() {
  const [notes, setNotes] = useState<RawNote[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  // Fetch notes and tags when the component mounts
  useEffect(() => {
    const loadNotesAndTags = async () => {
      const fetchedNotes = await fetchNotes();
      setNotes(fetchedNotes);
    };

    loadNotesAndTags();
  }, []);

  const notesWithTags = useMemo(() => {
    return notes.map((note) => {
      return {
        ...note,
        tags: tags.filter((tag) => note.tagIds.includes(tag.id)),
      };
    });
  }, [notes, tags]);

  async function onCreateNote({ tags, ...data }: NoteData) {
    const newNoteId = uuidV4(); 
    const newNote = { ...data, id: newNoteId, tagIds: tags.map((tag) => tag.id) };

    await createNote(newNote);

    setNotes((prevNotes) => [...prevNotes, newNote]);
  }

  async function onUpdateNote(id: string, { tags, ...data }: NoteData) {
    const updatedNote = { ...data, id, tagIds: tags.map((tag) => tag.id) };

    await updateNote(id, updatedNote);

    setNotes((prevNotes) => {
      return prevNotes.map((note) => (note.id === id ? updatedNote : note));
    });
  }

  async function onDeleteNote(id: string) {
    await deleteNote(id);

    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  }

  async function addTag(tag: Tag) {
    await createTag(tag);

    setTags((prev) => [...prev, tag]);
  }

  async function updateTag(id: string, label: string) {
    await updateTagApi(id, label);

    setTags((prevTags) =>
      prevTags.map((tag) => (tag.id === id ? { ...tag, label } : tag))
    );
  }

  async function deleteTag(id: string) {
    await deleteTagApi(id);

    setTags((prevTags) => prevTags.filter((tag) => tag.id !== id));
  }

  return (
    <Container className="my-4">
      <Routes>
        <Route
          path="/"
          element={
            <NoteList
              notes={notesWithTags}
              availableTags={tags}
              onUpdateTag={updateTag}
              onDeleteTag={deleteTag}
            />
          }
        />
        <Route
          path="/new"
          element={
            <NewNote
              onSubmit={onCreateNote}
              onAddTag={addTag}
              availableTags={tags}
            />
          }
        />
        <Route path="/:id" element={<NoteLayout notes={notesWithTags} />}>
          <Route
            index
            element={<NoteComponent onDelete={onDeleteNote} />}
          />
          <Route
            path="edit"
            element={
              <EditNote
                onSubmit={onUpdateNote}
                onAddTag={addTag}
                availableTags={tags}
              />
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Container>
  );
}

export default App;
