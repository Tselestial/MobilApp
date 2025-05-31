import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, StyleSheet, Text, View } from 'react-native';
import MapView, { LongPressEvent, Marker as MapMarker, Region } from 'react-native-maps';
import { useDatabase } from '../contexts/DatabaseContext';
import { calculateDistance, requestLocationPermissions, startLocationUpdates } from '../services/location';
import { NotificationManager } from '../services/notifications';
import { Marker, MarkerData } from '../types';

interface MapProps {
  initialRegion: Region;
}

export default function Map({ initialRegion }: MapProps) {
  const router = useRouter();
  const {
    markers,
    isLoading,
    error,
    addMarker,
  } = useDatabase();

  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [region, setRegion] = useState<Region>(initialRegion);
  const notificationManagerRef = useRef(new NotificationManager());

  const mappedMarkers: MarkerData[] = markers.map((m) => ({
    id: m.id.toString(),
    coordinate: { latitude: m.latitude, longitude: m.longitude },
    images: [],
  }));

  const handleLongPress = async (event: LongPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    try {
      const newId = await addMarker(latitude, longitude);
      if (!newId) {
        Alert.alert('Ошибка', 'Не удалось добавить маркер');
      }
    } catch (e) {
      console.error('Ошибка при добавлении маркера:', e);
      Alert.alert('Ошибка', 'Не удалось добавить маркер');
    }
  };

  const handleMarkerPress = (id: string) => {
    router.push({ pathname: '/marker/[id]', params: { id } });
  };

  useEffect(() => {
    let subscription: Location.LocationSubscription;

    const setupLocationTracking = async () => {
      try {
        await requestLocationPermissions();

        subscription = await startLocationUpdates((newLocation) => {
          setLocation(newLocation);

          setRegion({
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });

          if (markers.length > 0) {
            checkProximity(newLocation);
          }
        });
      } catch (error) {
        Alert.alert('Ошибка геолокации', String(error));
      }
    };

    setupLocationTracking();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [markers]);

  const PROXIMITY_THRESHOLD = 100;
  const checkProximity = (userLocation: Location.LocationObject) => {
    markers.forEach((marker: Marker) => {
      const distance = calculateDistance(
        userLocation.coords.latitude,
        userLocation.coords.longitude,
        marker.latitude,
        marker.longitude
      );

      if (distance <= PROXIMITY_THRESHOLD) {
        notificationManagerRef.current.showNotification(marker);
      } else {
        notificationManagerRef.current.removeNotification(marker.id);
      }
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Загрузка маркеров...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: 'red' }}>Ошибка: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Интерактивная карта</Text>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        onLongPress={handleLongPress}
        showsUserLocation={true}
        followsUserLocation={true}
      >
        {mappedMarkers.map(marker => (
          <MapMarker
            key={marker.id}
            coordinate={marker.coordinate}
            onPress={() => handleMarkerPress(marker.id)}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0.95,
    paddingTop: 80,
  },
  header: {
    position: 'absolute',
    paddingTop: 40,
    width: '100%',
    paddingVertical: 10,
    backgroundColor: '#fff',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    zIndex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
