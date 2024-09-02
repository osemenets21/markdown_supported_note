import { Navigate, Outlet, useOutletContext, useParams } from "react-router-dom";
import { Note } from "./App";
import { useEffect, useState } from "react";
import { fetchNote } from "./api"; // Ensure to implement this function in api.js

type NoteLayoutProps = {
  notes: Note[];
};

export function NoteLayout({ notes }: NoteLayoutProps) {
  const { id } = useParams();
  const [note, setNote] = useState<Note | null>(null);

  useEffect(() => {
    if (id) {
      fetchNote(id)
        .then(fetchedNote => setNote(fetchedNote))
        .catch(error => {
          console.error('Error fetching note:', error);
          setNote(null);
        });
    }
  }, [id]);

  if (note === null) return <Navigate to="/" replace />;

  return <Outlet context={note} />;
}

export function useNote() {
  return useOutletContext<Note>();
}
