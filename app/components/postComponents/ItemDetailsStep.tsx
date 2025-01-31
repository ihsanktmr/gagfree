import React, { useState } from "react";

import { Picker } from "@react-native-picker/picker";
import { distances } from "app/aesthetic/distances";
import { useThemeColor } from "app/hooks/useThemeColor";
import * as ImagePicker from "expo-image-picker";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";

import { ThemedView } from "../containers/ThemedView";
import { ThemedText } from "../texts/ThemedText";

interface ItemDetailsStepProps {
  onUpdateData: (data: {
    title: string;
    description: string;
    category: string;
    images: string[];
  }) => void;
  initialData?: {
    title: string;
    description: string;
    category: string;
    images: string[];
  };
}

const categories = [
  { label: "Select a category", value: "" },
  { label: "Furniture", value: "furniture" },
  { label: "Electronics", value: "electronics" },
  { label: "Clothing", value: "clothing" },
  { label: "Books", value: "books" },
  { label: "Kitchen", value: "kitchen" },
  { label: "Sports", value: "sports" },
  { label: "Other", value: "other" },
];

export const ItemDetailsStep: React.FC<ItemDetailsStepProps> = ({
  onUpdateData,
  initialData,
}) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || "",
  );
  const [category, setCategory] = useState(initialData?.category || "");
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    category: "",
    images: "",
  });

  const backgroundColor = useThemeColor("background");
  const textColor = useThemeColor("text");

  const pickImage = async () => {
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
    onUpdateData({ title, description, category, images: newImages });
  };

  const handleChange = (field: string, value: string) => {
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
    onUpdateData({ title, description, category, images });
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.form}>
        <TextInput
          label="Item Title"
          value={title}
          onChangeText={(value) => handleChange("title", value)}
          mode="outlined"
          error={!!errors.title}
          style={styles.input}
        />
        <HelperText type="error" visible={!!errors.title}>
          {errors.title}
        </HelperText>

        <TextInput
          label="Description"
          value={description}
          onChangeText={(value) => handleChange("description", value)}
          mode="outlined"
          multiline
          numberOfLines={4}
          error={!!errors.description}
          style={styles.input}
        />
        <HelperText type="error" visible={!!errors.description}>
          {errors.description}
        </HelperText>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={category}
            onValueChange={(value) => handleChange("category", value)}
            style={[styles.picker, { backgroundColor, color: textColor }]}
          >
            {categories.map((cat) => (
              <Picker.Item
                key={cat.value}
                label={cat.label}
                value={cat.value}
              />
            ))}
          </Picker>
        </View>

        <View style={styles.imageSection}>
          <ThemedText style={styles.imageTitle}>Photos</ThemedText>
          <View style={styles.imageContainer}>
            {images.map((uri, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri: uri }} style={styles.image} />
                <Button
                  icon="close"
                  onPress={() => removeImage(index)}
                  style={styles.removeButton}
                  children={undefined}
                />
              </View>
            ))}
            {images.length < 5 && (
              <Button
                mode="outlined"
                onPress={pickImage}
                style={styles.addImageButton}
              >
                Add Photo
              </Button>
            )}
          </View>
        </View>
      </ThemedView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    padding: distances.md,
  },
  input: {
    marginBottom: distances.sm,
  },
  pickerContainer: {
    marginBottom: distances.md,
    borderRadius: 4,
    overflow: "hidden",
  },
  picker: {
    height: 50,
  },
  imageSection: {
    marginTop: distances.md,
  },
  imageTitle: {
    fontSize: 16,
    marginBottom: distances.sm,
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
  removeButton: {
    position: "absolute",
    top: -8,
    right: -8,
  },
  addImageButton: {
    width: 100,
    height: 100,
    justifyContent: "center",
  },
});
