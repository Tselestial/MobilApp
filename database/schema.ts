import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('markers.db');

export const initDatabase = async () => {
  try {
    
    await db.runAsync(
      `CREATE TABLE IF NOT EXISTS markers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );`
    );

    await db.runAsync(
      `CREATE TABLE IF NOT EXISTS marker_images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        marker_id INTEGER NOT NULL,
        uri TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (marker_id) REFERENCES markers (id) ON DELETE CASCADE
      );`
    );

    console.log('База данных инициализирована');
    return db;
  } catch (error) {
    console.error('Ошибка инициализации базы данных:', error);
    throw error;
  }
};
