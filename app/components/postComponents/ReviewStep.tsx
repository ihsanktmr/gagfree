import React from "react";

import { distances } from "app/aesthetic/distances";
import { useThemeColor } from "app/hooks/useThemeColor";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { Chip, Divider, List } from "react-native-paper";

import { ThemedView } from "../containers/ThemedView";
import { ThemedText } from "../texts/ThemedText";

interface ReviewStepProps {
  itemDetails: {
    title: string;
    description: string;
    category: string;
    images: string[];
  };
  pickupDetails: {
    location: {
      address: string;
      additionalInfo: string;
    };
    pickupTimes: string[];
    contactMethod: string;
    contactDetails: string;
  };
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  itemDetails,
  pickupDetails,
}) => {
  const backgroundColor = useThemeColor("background");

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.section}>
        <List.Section>
          <List.Subheader style={styles.sectionHeader}>
            Item Details
          </List.Subheader>

          <ThemedView style={[styles.contentBox, { backgroundColor }]}>
            <List.Item
              title="Title"
              description={itemDetails.title || "Not provided"}
              descriptionStyle={styles.description}
            />
            <Divider />
            <List.Item
              title="Category"
              description={itemDetails.category || "Not provided"}
              descriptionStyle={styles.description}
            />
            <Divider />
            <List.Item
              title="Description"
              description={itemDetails.description || "Not provided"}
              descriptionStyle={styles.description}
            />
          </ThemedView>

          {itemDetails.images.length > 0 && (
            <View style={styles.imagesContainer}>
              <ThemedText style={styles.imagesTitle}>Photos</ThemedText>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {itemDetails.images.map((uri, index) => (
                  <Image key={index} source={{ uri }} style={styles.image} />
                ))}
              </ScrollView>
            </View>
          )}
        </List.Section>

        <List.Section>
          <List.Subheader style={styles.sectionHeader}>
            Pickup Details
          </List.Subheader>

          <ThemedView style={[styles.contentBox, { backgroundColor }]}>
            <List.Item
              title="Address"
              description={pickupDetails.location.address || "Not provided"}
              descriptionStyle={styles.description}
            />
            {pickupDetails.location.additionalInfo && (
              <>
                <Divider />
                <List.Item
                  title="Additional Location Info"
                  description={pickupDetails.location.additionalInfo}
                  descriptionStyle={styles.description}
                />
              </>
            )}
          </ThemedView>

          <ThemedView style={[styles.contentBox, { backgroundColor }]}>
            <List.Item
              title="Available Pickup Times"
              description={
                pickupDetails.pickupTimes.length > 0 ? (
                  <View style={styles.chipContainer}>
                    {pickupDetails.pickupTimes.map((time, index) => (
                      <Chip key={index} style={styles.chip}>
                        {time}
                      </Chip>
                    ))}
                  </View>
                ) : (
                  "No pickup times specified"
                )
              }
              descriptionStyle={styles.description}
            />
          </ThemedView>

          <ThemedView style={[styles.contentBox, { backgroundColor }]}>
            <List.Item
              title="Contact Method"
              description={pickupDetails.contactMethod || "Not provided"}
              descriptionStyle={styles.description}
            />
            <Divider />
            <List.Item
              title="Contact Details"
              description={pickupDetails.contactDetails || "Not provided"}
              descriptionStyle={styles.description}
            />
          </ThemedView>
        </List.Section>
      </ThemedView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    padding: distances.md,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: distances.sm,
  },
  contentBox: {
    borderRadius: 8,
    marginBottom: distances.md,
    overflow: "hidden",
  },
  description: {
    marginTop: distances.xs,
  },
  imagesContainer: {
    marginTop: distances.md,
  },
  imagesTitle: {
    fontSize: 14,
    marginBottom: distances.sm,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: distances.sm,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: distances.xs,
    marginTop: distances.xs,
  },
  chip: {
    marginBottom: distances.xs,
  },
});
