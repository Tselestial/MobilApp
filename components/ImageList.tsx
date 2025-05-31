import React from 'react';
import { View, Image, Button, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { MarkerImage } from '../types';

interface ImageListProps {
  images: MarkerImage[];
  onDelete: (id: number) => void;
}

export default function ImageList({ images, onDelete }: ImageListProps) {
  return (
    <SafeAreaView style={styles.container}>
        <FlatList
        data={images}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
            <View style={styles.imageContainer}>
            <Image source={{ uri: item.uri }} style={styles.image} />
            <Button title="Удалить" onPress={() => onDelete(item.id)} />
            </View>
        )}
        />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0.95,
  },
  imageContainer: {
    marginVertical: 8,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 4,
  },
});
