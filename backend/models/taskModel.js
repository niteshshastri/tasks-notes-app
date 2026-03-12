const { getDb } = require('../db/database');

class TaskModel {
  constructor() {
    this.db = getDb();
  }

  findAll({ search = '', status = '', priority = '', page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;
    const conditions = [];
    const params = [];

    if (search) {
      conditions.push(`(title LIKE ? OR description LIKE ?)`);
      params.push(`%${search}%`, `%${search}%`);
    }
    if (status) {
      conditions.push(`status = ?`);
      params.push(status);
    }
    if (priority) {
      conditions.push(`priority = ?`);
      params.push(priority);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const total = this.db
      .prepare(`SELECT COUNT(*) as count FROM tasks ${where}`)
      .get(...params).count;

    const rows = this.db
      .prepare(
        `SELECT * FROM tasks ${where}
         ORDER BY created_at DESC
         LIMIT ? OFFSET ?`
      )
      .all(...params, limit, offset);

    return { rows: rows.map(this._parse), total };
  }

  findById(id) {
    const row = this.db.prepare(`SELECT * FROM tasks WHERE id = ?`).get(id);
    return row ? this._parse(row) : null;
  }

  create({ title, description, status, priority, due_date, tags }) {
    const tagsJson = JSON.stringify(tags || []);
    const stmt = this.db.prepare(`
      INSERT INTO tasks (title, description, status, priority, due_date, tags)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
      title,
      description || null,
      status || 'todo',
      priority || 'medium',
      due_date || null,
      tagsJson
    );
    return this.findById(info.lastInsertRowid);
  }

  update(id, fields) {
    const allowed = ['title', 'description', 'status', 'priority', 'due_date', 'tags'];
    const updates = [];
    const params = [];

    for (const key of allowed) {
      if (fields[key] !== undefined) {
        updates.push(`${key} = ?`);
        params.push(key === 'tags' ? JSON.stringify(fields[key]) : fields[key]);
      }
    }

    if (!updates.length) return this.findById(id);

    updates.push(`updated_at = datetime('now')`);
    params.push(id);

    this.db
      .prepare(`UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`)
      .run(...params);

    return this.findById(id);
  }

  delete(id) {
    const info = this.db.prepare(`DELETE FROM tasks WHERE id = ?`).run(id);
    return info.changes > 0;
  }

  _parse(row) {
    return {
      ...row,
      tags: JSON.parse(row.tags || '[]'),
    };
  }
}

module.exports = new TaskModel();
