import {FormEvent, useState} from "react";
import {NotesMap} from "../interfaces";

async function fetchInsert(url: () => string, note: string) {
  return fetch(url(), {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({note: note})
  }).then(response => response.json()).then(json => json.message)
}

async function fetchDelete(url: () => string, noteId: number) {
  return fetch(url(), {
    method: "DELETE",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({noteId: noteId})
  }).then(response => response.json()).then(json => json.message)
}

export default function useNotes(initialNotes: NotesMap): [NotesMap, (event: React.FormEvent) => void, (noteId: number) => void] {

  const URL = () => `${window.location.origin}/api/notes`
  const [notes, setNotes] = useState<NotesMap>(initialNotes);

  const onAddNote = (event: FormEvent) => {
    const field = event.target[0]
    event.preventDefault();
    if (field.value) {
      fetchInsert(URL, field.value).then(json => {
        setNotes(json)
        field.value = ""
      }).catch(e => console.warn(e))
    }
  }

  const onDeleteNote = (noteId: number) => {
    fetchDelete(URL, noteId).then(json => {
      setNotes(json)
    }).catch(e => console.warn(e))
  }

  return [notes, onAddNote, onDeleteNote]
}
