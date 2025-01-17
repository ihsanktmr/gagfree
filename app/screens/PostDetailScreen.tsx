import React, { useState } from "react";

import { Entypo, Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { distances } from "app/aesthetic/distances";
import {
  genericSpacing,
  scrollViewBottomGap,
} from "app/aesthetic/styleConstants";
import { typography } from "app/aesthetic/typography";
import { Header } from "app/components/common/Header";
import { ThemedView } from "app/components/containers/ThemedView";
import { ThemedText } from "app/components/texts/ThemedText";
import { useData } from "app/hooks/useData";
import { useThemeColor } from "app/hooks/useThemeColor";
import { i18n } from "app/language";
import { useSnackbar } from "app/providers/SnackbarProvider";
import { addBookmark, removeBookmark } from "app/redux/post/actions";
import { selectBookmarkedPosts } from "app/redux/post/selectors";
import { sharePost } from "app/utils/share";
import * as Clipboard from "expo-clipboard";
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { Menu } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

const PostDetailScreen = () => {
  // Hooks
  const { goBack } = useNavigation();
  const route = useRoute();
  const { postId } = route.params;
  const posts = useData();
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();
  const bookmarkedPosts = useSelector(selectBookmarkedPosts);

  // Theme
  const iconColor = useThemeColor("icon");
  const backgroundColor = useThemeColor("background");
  const blueColor = useThemeColor("blue");

  // State
  const [menuVisible, setMenuVisible] = useState(false);

  // Data
  const post = posts.find((item) => item._id === postId);
  const isBookmarked = bookmarkedPosts.some((item) => item._id === post?._id);

  // Event Handlers
  const handleBookmarkToggle = () => {
    if (isBookmarked) {
      dispatch(removeBookmark(post._id));
      showSnackbar(i18n.t("removedFromBookmarks"), i18n.t("okay"));
    } else {
      dispatch(addBookmark(post));
      showSnackbar(i18n.t("savedToBookmarks"), i18n.t("okay"));
    }
    closeMenu();
  };

  const handleSharePost = () => {
    sharePost({ title: post.title });
    closeMenu();
  };

  const handleCopyAddress = () => {
    Clipboard.setStringAsync(`${post.title} ${post.contact.fullAddress}`);
    showSnackbar(i18n.t("addressCopied"), i18n.t("okay"));
  };

  const handlePhonePress = () =>
    Linking.openURL(`tel:0${post.contact.phoneNumber}`);
  const handlePhoneLongPress = () => {
    Clipboard.setStringAsync(`0${post.contact.phoneNumber}`);
    showSnackbar(i18n.t("phoneNumberCopied"), i18n.t("okay"));
  };

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  // If post is not found
  if (!post) return <Text>{i18n.t("notFound")}</Text>;

  // Render
  return (
    <ScrollView
      style={[styles.scrollContainer, { backgroundColor }]}
      contentContainerStyle={styles.containerContent}
    >
      <Header
        title={post.title}
        leftIcon={<Entypo name="chevron-left" size={24} color={iconColor} />}
        rightIcon={
          <Menu
            visible={menuVisible}
            onDismiss={closeMenu}
            anchor={
              <TouchableOpacity onPress={openMenu}>
                <Ionicons name="menu" size={24} color={iconColor} />
              </TouchableOpacity>
            }
          >
            <TouchableOpacity
              style={styles.menuOption}
              onPress={handleSharePost}
            >
              <Ionicons
                name="share-social-outline"
                size={24}
                color={iconColor}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuOption}
              onPress={handleBookmarkToggle}
            >
              <Ionicons
                name={isBookmarked ? "bookmark" : "bookmark-outline"}
                size={24}
                color={iconColor}
              />
            </TouchableOpacity>
          </Menu>
        }
        onLeftPress={goBack}
      />

      <ThemedView style={styles.content}>
        {post.images?.[0]?.imageUrl && (
          <Image
            source={{ uri: post.images[0].imageUrl }}
            style={styles.imageBig}
            resizeMode="stretch"
          />
        )}

        <ThemedView style={styles.postHeadline}>
          {post.images?.[0]?.imageUrl && (
            <Image
              source={{ uri: post.images[0].imageUrl }}
              style={styles.image}
              resizeMode="stretch"
            />
          )}
          <ThemedView style={styles.postDetailOverviewContainer}>
            <ThemedText style={styles.sectionName}>{post.title}</ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedText style={styles.sectionTitle}>
          {i18n.t("description")}
        </ThemedText>
        <ThemedText style={styles.description}>{post.description}</ThemedText>

        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            {i18n.t("contact")}
          </ThemedText>
          {post.contact.phoneNumber && (
            <TouchableOpacity
              onPress={handlePhonePress}
              onLongPress={handlePhoneLongPress}
            >
              <ThemedText style={styles.contactItem}>
                {i18n.t("phoneNumber")}:{" "}
                <Text style={[styles.contactItemBlue, { color: blueColor }]}>
                  {post.contact.phoneNumber}
                </Text>
              </ThemedText>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={handleCopyAddress}
            onLongPress={handleCopyAddress}
          >
            <ThemedText style={styles.contactItem}>
              {i18n.t("address")}: {post.contact.fullAddress}
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  containerContent: {
    paddingBottom: scrollViewBottomGap,
  },
  content: {
    paddingHorizontal: genericSpacing,
  },
  postHeadline: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: distances.sm,
  },
  postDetailOverviewContainer: {
    paddingHorizontal: distances.sm,
  },
  image: {
    height: 60,
    width: 60,
    borderRadius: 30,
  },
  imageBig: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginTop: distances.md,
  },
  sectionName: {
    fontSize: 16,
    fontFamily: typography.primary.bold,
    marginBottom: distances.xxs,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: typography.primary.bold,
    marginVertical: distances.md,
  },
  description: {
    fontSize: 16,
    fontFamily: typography.secondary.regular,
    marginBottom: distances.md,
  },
  contactItem: {
    fontSize: 14,
    fontFamily: typography.primary.bold,
  },
  contactItemBlue: {
    textDecorationLine: "underline",
  },
  section: {
    marginBottom: distances.xs,
  },
  menuOption: {
    padding: distances.md,
  },
});

export default PostDetailScreen;
