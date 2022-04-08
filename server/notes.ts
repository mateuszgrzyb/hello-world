import mysql, {Connection} from "mysql";
import {NotesMap} from "../interfaces";

interface MySQLConfigType {
  host: string
  user: string
  password: string
  database: string
  ssl?: { rejectUnauthorized: boolean }
}

function useConnection(): Connection {
  const config: MySQLConfigType = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  }
  if (!process.env.DB_NO_SSL) {
    config.ssl = {
      rejectUnauthorized: !process.env.DB_SSL
    }
  }
  return mysql.createConnection(config)
}

export async function selectNotes(): Promise<NotesMap> {
  const connection = useConnection()

  return new Promise((resolve, reject) =>
    connection.query("SELECT * FROM notes", (err, rows, _) => {
      if (err) {
        reject(err)
      } else {
        resolve(
          Object.fromEntries(rows.map(e => [e.id, e.text]))
        )
      }
    })
  );
}

export async function insertNote(note: string): Promise<NotesMap> {
  const connection = useConnection()

  return new Promise((resolve, reject) =>
    connection.query("INSERT INTO notes (text) values (?)", [note], (err, rows, _) => {
      if (err) {
        console.warn(err)
        reject(err)
      } else {
        selectNotes().then(notes => resolve(notes))
      }
    })
  )
}

export async function deleteNote(noteId: number): Promise<NotesMap> {
  const connection = useConnection()

  return new Promise((resolve, reject) =>
    connection.query("DELETE FROM notes WHERE id = ?", [noteId], (err, rows, _) => {
      if (err) {
        console.warn(err)
        reject(err)
      } else {
        selectNotes().then(notes => resolve(notes))
      }
    })
  )
}
