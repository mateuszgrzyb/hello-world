import Layout from "../../../hello-world.old/components/layout";
import useNotes from "../../utils/notes";
import {GetServerSideProps} from "next";
import {selectNotes} from "../../server/notes";
import {NotesMap} from "../../interfaces";

interface NotesProps {
  notes: NotesMap
}

export const getServerSideProps: GetServerSideProps<NotesProps> = async () => {
  const notes = await selectNotes()

  return {
    props: {
      notes: notes
    },
  }
}

const NotesPage = (props: NotesProps) => {
  const [notes, onAddNote, onDeleteNote] = useNotes(props.notes)

  return <Layout title="Notes | Next.js + TypeScript Example">
    <form onSubmit={onAddNote}>
      <input type="text"/>
      <input type="submit"/>
    </form>
    <ol>
      {(Object.keys(notes) as unknown as Array<keyof typeof notes>).map(i =>
        <li key={i}>
          {notes[i]}
          <button onClick={_ => onDeleteNote(i)}>delete</button>
        </li>
      )}
    </ol>
  </Layout>
}

export default NotesPage
