import React, { useState } from "react";

import { distances } from "app/aesthetic/distances";
import { typography } from "app/aesthetic/typography";
import { useThemeColor } from "app/hooks/useThemeColor";
import * as ImagePicker from "expo-image-picker";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Image } from "react-native";
import { Chip, IconButton, TextInput } from "react-native-paper";

import { ThemedText } from "../texts/ThemedText";

interface ItemDetailsProps {
  onUpdateData: (data: {
    title: string;
    description: string;
    category: string;
    images: string[];
  }) => void;
  initialData: {
    title: string;
    description: string;
    category: string;
    images: string[];
  };
}

const categories = [
  "Furniture",
  "Electronics",
  "Clothing",
  "Books",
  "Kitchen",
  "Sports",
  "Toys",
  "Other",
];

export const ItemDetailsStep: React.FC<ItemDetailsProps> = ({
  onUpdateData,
  initialData,
}) => {
  const [title, setTitle] = useState(initialData.title);
  const [description, setDescription] = useState(initialData.description);
  const [category, setCategory] = useState(initialData.category);
  const [images, setImages] = useState<string[]>(initialData.images);

  const textColor = useThemeColor("text");
  const mainColor = useThemeColor("main");
  const surfaceColor = useThemeColor("surface");

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0].uri) {
      setImages([...images, result.assets[0].uri]);
      onUpdateData({
        title,
        description,
        category,
        images: [...images, result.assets[0].uri],
      });
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onUpdateData({
      title,
      description,
      category,
      images: newImages,
    });
  };

  const updateField = (field: string, value: string) => {
    switch (field) {
      case "title":
        setTitle(value);
        break;
      case "description":
        setDescription(value);
        break;
      case "category":
        setCategory(value);
        break;
    }
    onUpdateData({
      title: field === "title" ? value : title,
      description: field === "description" ? value : description,
      category: field === "category" ? value : category,
      images,
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <ThemedText style={styles.label}>Title</ThemedText>
        <TextInput
          mode="outlined"
          value={title}
          onChangeText={(text) => updateField("title", text)}
          placeholder="What are you giving away?"
          style={styles.input}
          maxLength={50}
        />
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.label}>Category</ThemedText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
        >
          {categories.map((cat) => (
            <Chip
              key={cat}
              selected={category === cat}
              onPress={() => updateField("category", cat)}
              style={[
                styles.categoryChip,
                category === cat && { backgroundColor: mainColor },
              ]}
              textStyle={[
                styles.chipText,
                category === cat && { color: "white" },
              ]}
            >
              {cat}
            </Chip>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.label}>Description</ThemedText>
        <TextInput
          mode="outlined"
          value={description}
          onChangeText={(text) => updateField("description", text)}
          placeholder="Describe your item (condition, size, etc.)"
          multiline
          numberOfLines={4}
          style={styles.input}
          maxLength={500}
        />
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.label}>Photos</ThemedText>
        <View style={styles.imageContainer}>
          {images.map((uri, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri }} style={styles.image} />
              <IconButton
                icon="close-circle"
                size={20}
                style={styles.removeImage}
                onPress={() => removeImage(index)}
              />
            </View>
          ))}
          {images.length < 5 && (
            <TouchableOpacity
              style={[styles.addImageButton, { borderColor: mainColor }]}
              onPress={handleImagePick}
            >
              <IconButton icon="camera-plus" size={24} iconColor={mainColor} />
              <ThemedText style={[styles.addImageText, { color: mainColor }]}>
                Add Photo
              </ThemedText>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: distances.lg,
  },
  label: {
    fontSize: 16,
    fontFamily: typography.primary.medium,
    marginBottom: distances.xs,
  },
  input: {
    backgroundColor: "transparent",
  },
  categoryContainer: {
    flexDirection: "row",
    marginTop: distances.xs,
  },
  categoryChip: {
    marginRight: distances.xs,
    marginBottom: distances.xs,
  },
  chipText: {
    fontSize: 14,
    fontFamily: typography.primary.regular,
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: distances.sm,
  },
  imageWrapper: {
    position: "relative",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImage: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "white",
    borderRadius: 12,
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  addImageText: {
    fontSize: 12,
    fontFamily: typography.primary.medium,
    marginTop: -distances.xs,
  },
});
