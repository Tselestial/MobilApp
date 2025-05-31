import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { MarkerData } from '../types';

interface MarkerListProps {
  markers: MarkerData[];
  onSelect: (id: string) => void;
}

export default function MarkerList({ markers, onSelect }: MarkerListProps) {
  return (
    <FlatList
      data={markers}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.item} onPress={() => onSelect(item.id)}>
          <Text>Маркер: {item.id}</Text>
          <Text>
            {item.coordinate.latitude.toFixed(4)}, {item.coordinate.longitude.toFixed(4)}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
});
