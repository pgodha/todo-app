import Database from 'better-sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const db = new Database(join(__dirname, 'todos.db'))

db.pragma('journal_mode = WAL')

db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id         TEXT    PRIMARY KEY,
    text       TEXT    NOT NULL,
    completed  INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL
  )
`)

export default db
