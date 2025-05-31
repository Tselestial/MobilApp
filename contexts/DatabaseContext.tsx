import React, { createContext, useEffect, useState } from 'react';
import { addImage, addMarker, deleteImage, deleteMarker, getMarkerImages, getMarkers } from '../database/operations';
import { initDatabase } from '../database/schema';
import type { Marker, MarkerImage } from '../types';

interface DatabaseContextType {
  markers: Marker[];
  isLoading: boolean;
  error: Error | null;
  loadMarkers: () => Promise<void>;
  addMarker: (latitude: number, longitude: number) => Promise<number | null>;
  deleteMarker: (id: number) => Promise<void>;
  getMarkerImages: (markerId: number) => Promise<MarkerImage[]>;
  addImage: (markerId: number, uri: string) => Promise<void>;
  deleteImage: (id: number) => Promise<void>;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    const prepareDb = async () => {
      try {
        await initDatabase();
        setDbReady(true);
      } catch (err) {
        setError(err as Error);
      }
    };
    prepareDb();
  }, []);

  const loadMarkers = async () => {
    if (!dbReady) return;
    setIsLoading(true);
    try {
      const data = await getMarkers();
      setMarkers(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (dbReady) {
      loadMarkers();
    }
  }, [dbReady]);

  const addMarkerHandler = async (latitude: number, longitude: number): Promise<number | null> => {
    if (!dbReady) return null;
    try {
      const id = await addMarker(latitude, longitude);
      await loadMarkers();
      return id;
    } catch (err) {
      setError(err as Error);
      return null;
    }
  };

  const deleteMarkerHandler = async (id: number) => {
    if (!dbReady) return;
    try {
      await deleteMarker(id);
      await loadMarkers();
      setError(null);
    } catch (err) {
      setError(err as Error);
    }
  };

  const addImageHandler = async (markerId: number, uri: string) => {
    if (!dbReady) return;
    try {
      await addImage(markerId, uri);
      setError(null);
    } catch (err) {
      setError(err as Error);
    }
  };

  const deleteImageHandler = async (id: number) => {
    if (!dbReady) return;
    try {
      await deleteImage(id);
      setError(null);
    } catch (err) {
      setError(err as Error);
    }
  };

  const getMarkerImagesHandler = async (markerId: number): Promise<MarkerImage[]> => {
    if (!dbReady) return [];
    try {
      const images = await getMarkerImages(markerId);
      setError(null);
      return images;
    } catch (err) {
      setError(err as Error);
      return [];
    }
  };

  return (
    <DatabaseContext.Provider
      value={{
        markers,
        isLoading,
        error,
        loadMarkers,
        addMarker: addMarkerHandler,
        deleteMarker: deleteMarkerHandler,
        getMarkerImages: getMarkerImagesHandler,
        addImage: addImageHandler,
        deleteImage: deleteImageHandler,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = (): DatabaseContextType => {
  const context = React.useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};
