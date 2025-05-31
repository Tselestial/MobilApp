import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Button, FlatList, Image, Text, View } from 'react-native';
import { useDatabase } from '../../contexts/DatabaseContext';
import type { MarkerImage } from '../../types';

export default function MarkerDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getMarkerImages, addImage, deleteImage } = useDatabase();
  const [images, setImages] = useState<MarkerImage[]>([]);

  useEffect(() => {
    if (id) {
      getMarkerImages(Number(id))
        .then(setImages)
        .catch((e) => {
          console.error(e);
          Alert.alert('Ошибка', 'Не удалось загрузить изображения маркера');
        });
    }
  }, [id]);

  const handleAddImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0 && id) {
        const uri = result.assets[0].uri;
        await addImage(Number(id), uri);
        const updated = await getMarkerImages(Number(id));
        setImages(updated);
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось добавить изображение.');
      console.error(error);
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    try {
      await deleteImage(imageId);
      if (id) {
        const updated = await getMarkerImages(Number(id));
        setImages(updated);
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось удалить изображение.');
      console.error(error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Маркер {id}</Text>
      <Button title="Добавить изображение" onPress={handleAddImage} />
      <FlatList
        data={images}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 8 }}>
            <Image source={{ uri: item.uri }} style={{ width: '100%', height: 200 }} resizeMode="cover" />
            <Button title="Удалить" onPress={() => handleDeleteImage(item.id)} />
          </View>
        )}
      />
      <Button title="Назад к карте" onPress={() => router.back()} />
    </View>
  );
}
