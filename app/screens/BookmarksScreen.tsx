import React from "react";

import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Header } from "app/components/common/Header";
import BookmarkList from "app/components/lists/BookmarkList";
import { useThemeColor } from "app/hooks/useThemeColor";
import { selectBookmarkedPosts } from "app/redux/post/selectors";
import { useSelector } from "react-redux";

export function BookmarksScreen() {
  const navigation = useNavigation();
  const iconColor = useThemeColor("icon");
  const bookmarkedPosts = useSelector(selectBookmarkedPosts);

  const hasBookmarks = bookmarkedPosts.length > 0;

  const handleGoBack = () => navigation.goBack();

  return (
    <>
      <Header
        title="Bookmarks"
        leftIcon={<Entypo name="chevron-left" size={24} color={iconColor} />}
        onLeftPress={handleGoBack}
      />
      {hasBookmarks && <BookmarkList data={bookmarkedPosts} />}
    </>
  );
}
