import { db } from './schema';

export interface Marker {
  id: number;
  latitude: number;
  longitude: number;
  created_at: string;
}

export interface MarkerImage {
  id: number;
  marker_id: number;
  uri: string;
  created_at: string;
}

//Добавление
export const addMarker = async (latitude: number, longitude: number): Promise<number> => {
  const result = await db.runAsync(
    'INSERT INTO markers (latitude, longitude) VALUES (?, ?)',
    [latitude, longitude]
  );
  return result.lastInsertRowId as number;
};

//Удаление
export const deleteMarker = async (id: number): Promise<void> => {
  await db.runAsync('DELETE FROM markers WHERE id = ?', [id]);
};

//Получение всех маркеров
export const getMarkers = async (): Promise<Marker[]> => {
  const result = await db.getAllAsync<Marker>('SELECT * FROM markers ORDER BY created_at DESC');
  return result;
};

//Добавление изображения
export const addImage = async (markerId: number, uri: string): Promise<void> => {
  await db.runAsync(
    'INSERT INTO marker_images (marker_id, uri) VALUES (?, ?)',
    [markerId, uri]
  );
};

//Удаление изображения
export const deleteImage = async (id: number): Promise<void> => {
  await db.runAsync('DELETE FROM marker_images WHERE id = ?', [id]);
};

//Получение всех изображений
export const getMarkerImages = async (markerId: number): Promise<MarkerImage[]> => {
  const result = await db.getAllAsync<MarkerImage>(
    'SELECT * FROM marker_images WHERE marker_id = ? ORDER BY created_at DESC',
    [markerId]
  );
  return result;
};
