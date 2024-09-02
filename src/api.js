// api.js

const API_BASE_URL = 'http://localhost:5000/api';

// Fetch all notes from the server
export const fetchNotes = async () => {
  const response = await fetch(`${API_BASE_URL}/notes`);
  const data = await response.json();
  return data.notes;
};

// function to retrieve a specific note by ID
export async function fetchNote(id) {
  const response = await fetch(`http://localhost:5000/api/notes/${id}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

// Fetch all tags from the server
export const fetchTags = async () => {
  const response = await fetch(`${API_BASE_URL}/tags`);
  const data = await response.json();
  return data.tags;
};

// Create a new note on the server
export async function createNote(note) {
  const response = await fetch(`${API_BASE_URL}/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  });
  if (!response.ok) {
    throw new Error('Failed to create note');
  }
  return await response.json();
}

// Update an existing note on the server
export const updateNote = async (id, updatedNote) => {
  await fetch(`${API_BASE_URL}/notes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedNote),
  });
};

// Delete a note from the server
export const deleteNote = async (id) => {
  await fetch(`${API_BASE_URL}/notes/${id}`, {
    method: 'DELETE',
  });
};

// Create a new tag on the server
export const createTag = async (tag) => {
  const response = await fetch(`${API_BASE_URL}/tags`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tag),
  });
  const data = await response.json();
  return data.id;
};

// Update an existing tag on the server
export const updateTag = async (id, label) => {
  await fetch(`${API_BASE_URL}/tags/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ label }),
  });
};

// Delete a tag from the server
export const deleteTag = async (id) => {
  await fetch(`${API_BASE_URL}/tags/${id}`, {
    method: 'DELETE',
  });
};
