import 'server-only'
import { deleteRecord, isValidId, newId, readRecords, writeRecord } from './store'

export type Message = {
  id: string
  name: string
  email: string
  subject: string
  message: string
  createdAt: string
  read: boolean
}

/** Hard cap so the public contact form cannot be used to fill up storage. */
export const MAX_STORED_MESSAGES = 500

function normalizeMessage(raw: unknown): Message | null {
  if (!raw || typeof raw !== 'object') return null
  const data = raw as Record<string, unknown>
  if (!isValidId(data.id) || typeof data.message !== 'string') return null
  return {
    id: data.id,
    name: typeof data.name === 'string' ? data.name : '',
    email: typeof data.email === 'string' ? data.email : '',
    subject: typeof data.subject === 'string' ? data.subject : '',
    message: data.message,
    createdAt: typeof data.createdAt === 'string' ? data.createdAt : new Date(0).toISOString(),
    read: data.read === true,
  }
}

export async function listMessages(): Promise<Message[]> {
  return (await readRecords('messages'))
    .map(normalizeMessage)
    .filter((message): message is Message => message !== null)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
}

export async function addMessage(input: Pick<Message, 'name' | 'email' | 'subject' | 'message'>): Promise<void> {
  const message: Message = { ...input, id: newId(), createdAt: new Date().toISOString(), read: false }
  await writeRecord('messages', message.id, message)
}

export async function setMessageRead(id: string, read: boolean): Promise<void> {
  const message = (await listMessages()).find((item) => item.id === id)
  if (message) await writeRecord('messages', id, { ...message, read })
}

export async function deleteMessage(id: string): Promise<void> {
  await deleteRecord('messages', id)
}
