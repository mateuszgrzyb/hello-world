import {FormEvent, useState} from "react";
import {NotesMap} from "../interfaces";

async function fetchInsert(note: string) {
  return fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notes`, {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({note: note})
  }).then(response => response.json()).then(json => json.message)
}

async function fetchDelete(noteId: number) {
  return fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notes`, {
    method: "DELETE",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({noteId: noteId})
  }).then(response => response.json()).then(json => json.message)
}

async function fetchGet() {
  return fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notes`, {
    method: "GET",
  }).then(response => response.json()).then(json => json.message)
}

export default function useNotes(initialNotes: NotesMap): [NotesMap, (event: React.FormEvent) => void, (noteId: number) => void] {

  const [notes, setNotes] = useState<NotesMap>(initialNotes);

  const onAddNote = (event: FormEvent) => {
    const field = event.target[0]
    event.preventDefault();
    if (field.value) {
      fetchInsert(field.value).then(json => {
        setNotes(json)
        field.value = ""
      }).catch(e => console.warn(e))
    }
  }

  const onDeleteNote = (noteId: number) => {
    fetchDelete(noteId).then(json => {
      setNotes(json)
    }).catch(e => console.warn(e))
  }

  return [notes, onAddNote, onDeleteNote]
}
