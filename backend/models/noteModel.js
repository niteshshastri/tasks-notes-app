const { getDb } = require('../db/database');

class NoteModel {
  constructor() {
    this.db = getDb();
  }

  findByTaskId(taskId) {
    return this.db
      .prepare(`SELECT * FROM notes WHERE task_id = ? ORDER BY created_at DESC`)
      .all(taskId);
  }

  findById(id) {
    return this.db.prepare(`SELECT * FROM notes WHERE id = ?`).get(id);
  }

  create(taskId, content) {
    const info = this.db
      .prepare(`INSERT INTO notes (task_id, content) VALUES (?, ?)`)
      .run(taskId, content);
    return this.findById(info.lastInsertRowid);
  }

  update(id, content) {
    this.db
      .prepare(`UPDATE notes SET content = ?, updated_at = datetime('now') WHERE id = ?`)
      .run(content, id);
    return this.findById(id);
  }

  delete(id) {
    const info = this.db.prepare(`DELETE FROM notes WHERE id = ?`).run(id);
    return info.changes > 0;
  }
}

module.exports = new NoteModel();
