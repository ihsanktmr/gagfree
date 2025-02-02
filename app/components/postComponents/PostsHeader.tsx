import React, { useCallback, useMemo } from "react";

import { distances } from "app/aesthetic/distances";
import { useThemeColor } from "app/hooks/useThemeColor";
import { i18n } from "app/language";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { FlatList, ListRenderItem } from "react-native";

import { FilterChip } from "../common/FilterChip";
import { Icon } from "../common/Icon";
import { MaterialIconName } from "../common/Icon";
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

  const handleSearchPress = useCallback(() => {
    if (view === "list") {
      setShowSearch(true);
    }
  }, [view, setShowSearch]);

  const handleSearchClose = useCallback(() => {
    setShowSearch(false);
    setSearchQuery("");
  }, [setShowSearch, setSearchQuery]);

  const handleCategoryPress = useCallback(
    (category: string) => {
      setSelectedCategory(selectedCategory === category ? null : category);
    },
    [selectedCategory, setSelectedCategory],
  );

  const handleViewToggle = useCallback(() => {
    setView(isViewMap ? "list" : "map");
    if (showSearch) {
      handleSearchClose();
    }
  }, [isViewMap, setView, showSearch, handleSearchClose]);

  const viewIcon: MaterialIconName = useMemo(
    () => (isViewMap ? "view-list" : "map"),
    [isViewMap],
  );

  const renderCategory: ListRenderItem<string> = useCallback(
    ({ item }) => (
      <FilterChip
        label={item}
        selected={selectedCategory === item}
        onPress={() => handleCategoryPress(item)}
      />
    ),
    [selectedCategory, handleCategoryPress],
  );

  const keyExtractor = useCallback((item: string) => item, []);

  const renderRightIcon = useMemo(
    () => (
      <TouchableOpacity onPress={handleViewToggle} style={styles.iconContainer}>
        <Icon type="material" name={viewIcon} color={iconColor} size={24} />
      </TouchableOpacity>
    ),
    [viewIcon, iconColor, handleViewToggle],
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <SearchHeader
          title={i18n.t("posts")}
          showSearch={showSearch}
          onSearchPress={handleSearchPress}
          onSearchClose={handleSearchClose}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          hideSearchIcon={isViewMap}
          placeholder={i18n.t("searchPosts")}
          rightIcon={renderRightIcon}
        />
      </View>

      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={keyExtractor}
          renderItem={renderCategory}
          showsHorizontalScrollIndicator={false}
          style={styles.categoryList}
          contentContainerStyle={styles.categoryListContent}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: distances.lg,
  },
  headerContainer: {
    paddingHorizontal: distances.md,
    marginBottom: distances.sm,
  },
  iconContainer: {
    padding: distances.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  filterContainer: {
    paddingVertical: distances.sm,
    paddingHorizontal: distances.md,
  },
  categoryList: {
    flexGrow: 0,
  },
  categoryListContent: {
    paddingRight: distances.md,
    alignItems: "center",
  },
});
