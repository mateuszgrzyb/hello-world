import {NextApiRequest, NextApiResponse} from "next";
import {deleteNote, insertNote, selectNotes} from "../../../server/notes";
import {NotesMap} from "../../../interfaces";

interface HTTPMethodResolverType {
  GET: (body: any) => Promise<NotesMap>
  POST: (body: any) => Promise<NotesMap>
  DELETE: (body: any) => Promise<NotesMap>
}

const HTTPMethodResolver: HTTPMethodResolverType = {
  GET: async (_) => await selectNotes(),
  POST: async (body) => await insertNote(body.note),
  DELETE: async (body) => await deleteNote(body.noteId)
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const notes = await HTTPMethodResolver[req.method](req.body)
    res.status(200).json({ statusCode: 200, message: notes })
  } catch (err: any) {
    res.status(500).json({ statusCode: 500, message: err.message })
  }
}

export default handler
