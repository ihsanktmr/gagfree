import React from "react";

import { typography } from "app/aesthetic/typography";
import { ThemedText } from "app/components/texts/ThemedText";
import { useThemeColor } from "app/hooks/useThemeColor";
import { i18n } from "app/language";
import { FlatList, StyleSheet } from "react-native";

import BookmarkComponent from "./BookmarkComponent";

interface BookmarkListProps {
  data: any[]; // Replace `any` with a proper type for your data if available.
}

const BookmarkList: React.FC<BookmarkListProps> = ({ data }) => {
  const backgroundColor = useThemeColor("background");

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <BookmarkComponent item={item} />}
      keyExtractor={(item) => item._id}
      ListEmptyComponent={
        <ThemedText style={styles.calloutTitle}>
          {i18n.t("bookmarkEmptyText")}
        </ThemedText>
      }
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.contentContainer, { backgroundColor }]}
      style={[styles.container, { backgroundColor }]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 10,
    paddingBottom: 30,
  },
  calloutTitle: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: typography.primary.bold,
    width: "100%",
  },
});

export default BookmarkList;
