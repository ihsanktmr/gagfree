import React from "react";

import { typography } from "app/aesthetic/typography";
import { useThemeColor } from "app/hooks/useThemeColor";
import { i18n } from "app/language";
import { FlatList, StyleSheet } from "react-native";

import { ThemedText } from "../texts/ThemedText";
import BookmarkComponent from "./BookmarkComponent";

// List

const BookmarkList = ({ data }) => {
  const backgroundColor = useThemeColor("background");

  const renderItem = ({ item }) => {
    return <BookmarkComponent item={item} />;
  };

  return (
    <FlatList
      ListEmptyComponent={() => (
        <ThemedText style={stylesFlatList.calloutTitle}>
          {i18n.t("bookmarkEmptyText")}
        </ThemedText>
      )}
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        ...stylesFlatList.contentContainer,
        backgroundColor,
      }}
      style={{
        ...stylesFlatList.container,
        backgroundColor,
      }}
    />
  );
};

const stylesFlatList = StyleSheet.create({
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
