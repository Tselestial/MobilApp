import React from 'react';
import { View, StyleSheet } from 'react-native';
import Map from '../components/Map';
import { Region } from 'react-native-maps';

export default function HomeScreen() {

  const initialRegion: Region = {
    latitude: 58.010457,
    longitude: 56.234381,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <View style={styles.container}>
      <Map initialRegion={initialRegion} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
