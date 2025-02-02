import React from "react";

import { distances } from "app/aesthetic/distances";
import { useThemeColor } from "app/hooks/useThemeColor";
import { i18n } from "app/language";
import { StyleSheet, View } from "react-native";
import { FlatList } from "react-native";
import { IconButton } from "react-native-paper";

import { FilterChip } from "../common/FilterChip";
import { SearchHeader } from "../common/SearchHeader";

interface PostsHeaderProps {
  view: "map" | "list";
  setView: (view: "map" | "list") => void;
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categories: string[];
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
}

export const PostsHeader: React.FC<PostsHeaderProps> = ({
  view,
  setView,
  showSearch,
  setShowSearch,
  searchQuery,
  setSearchQuery,
  categories,
  selectedCategory,
  setSelectedCategory,
}) => {
  const iconColor = useThemeColor("icon");
  const isViewMap = view === "map";

  const handleSearchPress = () => {
    if (view === "list") {
      setShowSearch(true);
    }
  };

  const handleSearchClose = () => {
    setShowSearch(false);
    setSearchQuery("");
  };

  const handleCategoryPress = (category: string) => {
    console.log("PostsHeader - Category press handler");
    console.log("Current selected:", selectedCategory);
    console.log("Pressed category:", category);

    // Toggle category selection
    if (selectedCategory === category) {
      console.log("Deselecting category");
      setSelectedCategory(null);
    } else {
      console.log("Selecting new category");
      setSelectedCategory(category);
    }
  };

  console.log("PostsHeader - Current selected category:", selectedCategory);
  console.log("PostsHeader - Available categories:", categories);

  return (
    <>
      <SearchHeader
        title={i18n.t("posts")}
        showSearch={showSearch}
        onSearchPress={() => view === "list" && setShowSearch(true)}
        onSearchClose={() => {
          setShowSearch(false);
          setSearchQuery("");
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        hideSearchIcon={isViewMap}
        placeholder={i18n.t("searchPosts")}
        rightIcon={
          <IconButton
            icon={isViewMap ? "view-list" : "map"}
            iconColor={iconColor}
            onPress={() => {
              setView(isViewMap ? "list" : "map");
              if (showSearch) {
                setShowSearch(false);
                setSearchQuery("");
              }
            }}
          />
        }
      />

      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item}
          renderItem={({ item }) => {
            console.log(
              `Rendering chip for category: ${item}, Selected: ${selectedCategory === item}`,
            );
            return (
              <FilterChip
                label={item}
                selected={selectedCategory === item}
                onPress={() => handleCategoryPress(item)}
              />
            );
          }}
          showsHorizontalScrollIndicator={false}
          style={styles.categoryList}
          contentContainerStyle={styles.categoryListContent}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    padding: distances.md,
  },
  categoryList: {
    marginTop: distances.sm,
  },
  categoryListContent: {
    paddingRight: distances.md,
  },
});
