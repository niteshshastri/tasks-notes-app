-- Tasks & Notes Application Schema
-- Run this file to initialize the database manually (SQLite)

CREATE TABLE IF NOT EXISTS tasks (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT    NOT NULL,
  description TEXT,
  status      TEXT    NOT NULL DEFAULT 'todo'
                      CHECK(status IN ('todo', 'in_progress', 'done')),
  priority    TEXT    NOT NULL DEFAULT 'medium'
                      CHECK(priority IN ('low', 'medium', 'high')),
  due_date    TEXT,
  tags        TEXT    DEFAULT '[]',  -- JSON array stored as text
  created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS notes (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  task_id     INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  content     TEXT    NOT NULL,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_tasks_status   ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_notes_task_id  ON notes(task_id);
