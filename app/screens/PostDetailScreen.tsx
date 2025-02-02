import React, { useState } from "react";

import { Entypo, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { distances } from "app/aesthetic/distances";
import { scrollViewBottomGap } from "app/aesthetic/styleConstants";
import { typography } from "app/aesthetic/typography";
import { Header } from "app/components/common/Header";
import { ThemedView } from "app/components/containers/ThemedView";
import { ThemedText } from "app/components/texts/ThemedText";
import { useData } from "app/hooks/useData";
import { useThemeColor } from "app/hooks/useThemeColor";
import { i18n } from "app/language";
import { RootStackParamList } from "app/navigation/types";
import { useSnackbar } from "app/providers/SnackbarProvider";
import { addBookmark, removeBookmark } from "app/redux/post/actions";
import { selectBookmarkedPosts, selectPosts } from "app/redux/post/selectors";
import { Post } from "app/redux/post/types";
import { sharePost } from "app/utils/share";
import * as Clipboard from "expo-clipboard";
import { Alert, Platform } from "react-native";
import {
  Dimensions,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Divider, Menu } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

// Make sure to import the Post type

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IMAGE_HEIGHT = SCREEN_WIDTH * 0.6; // Aspect ratio 5:3

type PostDetailNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "PostDetail"
>;

type PostDetailRouteProp = RouteProp<RootStackParamList, "PostDetail">;

interface RouteParams {
  postId: string;
  post?: Post;
}

const PostDetailScreen = () => {
  // Hooks
  const navigation = useNavigation<PostDetailNavigationProp>();
  const route = useRoute<PostDetailRouteProp>();
  const { postId, post: passedPost } = route.params as RouteParams;
  const posts = useData();
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();
  const bookmarkedPosts = useSelector(selectBookmarkedPosts);
  const allPosts = useSelector(selectPosts);

  // Theme
  const iconColor = useThemeColor("icon");
  const backgroundColor = useThemeColor("background");
  const blueColor = useThemeColor("blue");
  const dangerColor = useThemeColor("danger");

  // State
  const [menuVisible, setMenuVisible] = useState(false);

  // Data
  const post = passedPost || posts.find((item) => item._id === postId);
  const isBookmarked = bookmarkedPosts.some((item) => item._id === post?._id);

  console.log("PostDetailScreen - Details:", {
    receivedPostId: postId,
    hasPassedPost: !!passedPost,
    foundPost: post
      ? {
          id: post._id,
          title: post.title,
          category: post.category,
        }
      : "not found",
    availablePosts: allPosts.map((p) => ({
      id: p._id,
      title: p.title,
    })),
  });

  // Debug log
  console.log("Viewing post detail for ID:", postId);

  // Event Handlers
  const handleBookmarkToggle = () => {
    if (!post) return;

    if (isBookmarked) {
      dispatch(removeBookmark(post._id));
      showSnackbar(i18n.t("removedFromBookmarks"), i18n.t("okay"), () => {});
    } else {
      dispatch(addBookmark(post));
      showSnackbar(i18n.t("savedToBookmarks"), i18n.t("okay"), () => {});
    }
    closeMenu();
  };

  const handleSharePost = () => {
    if (!post) return;
    sharePost({ title: post.title });
    closeMenu();
  };

  const handleCopyAddress = () => {
    if (!post) return;
    Clipboard.setStringAsync(`${post.title} ${post.contact.fullAddress}`);
    showSnackbar(i18n.t("addressCopied"), i18n.t("okay"), () => {});
  };

  const handlePhonePress = () => {
    if (!post) return;
    Linking.openURL(`tel:0${post.contact.phoneNumber}`);
  };

  const handlePhoneLongPress = () => {
    if (!post) return;
    Clipboard.setStringAsync(`0${post.contact.phoneNumber}`);
    showSnackbar(i18n.t("phoneNumberCopied"), i18n.t("okay"), () => {});
  };

  const handleStartChat = async () => {
    if (!post) return;

    const chatData = {
      postId: post._id,
      postTitle: post.title,
      sellerId: post.userId,
      lastMessage: null,
      createdAt: new Date().toISOString(),
    };

    navigation.navigate("ChatDetail", {
      chatId: post._id,
      postId: post._id,
      title: post.title,
      otherUserId: post.userId,
    });

    closeMenu();
  };

  const handleOpenMaps = () => {
    if (!post?.contact?.fullAddress) return;

    const address = encodeURIComponent(post.contact.fullAddress);

    // Handle both iOS and Android
    const scheme = Platform.select({ ios: "maps:", android: "geo:0,0?q=" });
    const url = Platform.select({
      ios: `${scheme}?q=${address}`,
      android: `${scheme}${address}`,
    });

    if (url) {
      Linking.canOpenURL(url)
        .then((supported) => {
          if (supported) {
            return Linking.openURL(url);
          }
          // Fallback to web maps if app isn't installed
          return Linking.openURL(
            `https://www.google.com/maps/search/?api=1&query=${address}`,
          );
        })
        .catch(() => {
          showSnackbar(i18n.t("errorOpeningMaps"), i18n.t("okay"), () => {});
        });
    }
    closeMenu();
  };

  const handleReport = () => {
    if (!post) return;

    // Show confirmation dialog before reporting
    Alert.alert(i18n.t("reportPostTitle"), i18n.t("reportPostMessage"), [
      {
        text: i18n.t("cancel"),
        style: "cancel",
      },
      {
        text: i18n.t("report"),
        style: "destructive",
        onPress: () => {
          // Here you would typically call an API to report the post
          // For now, we'll just show a success message
          showSnackbar(i18n.t("reportSent"), i18n.t("okay"), () => {});
          // You might want to add the post to a local "reported" list
          // dispatch(reportPost(post._id));
        },
      },
    ]);
    closeMenu();
  };

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const renderActionButton = (
    icon: string,
    label: string,
    onPress: () => void,
  ) => (
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
      <Ionicons name={icon} size={24} color={iconColor} />
      <ThemedText style={styles.actionButtonText}>{label}</ThemedText>
    </TouchableOpacity>
  );

  const renderContactItem = (
    icon: string,
    label: string,
    value: string | undefined,
    onPress: () => void,
    onLongPress?: () => void,
  ) => {
    if (!value) return null;

    return (
      <TouchableOpacity
        style={styles.contactItem}
        onPress={onPress}
        onLongPress={onLongPress}
      >
        <MaterialCommunityIcons
          name={icon}
          size={24}
          color={iconColor}
          style={styles.contactIcon}
        />
        <View style={styles.contactTextContainer}>
          <ThemedText style={styles.contactLabel}>{label}</ThemedText>
          <ThemedText style={[styles.contactValue, { color: blueColor }]}>
            {value}
          </ThemedText>
        </View>
      </TouchableOpacity>
    );
  };

  // If post is not found
  if (!post)
    return (
      <ThemedView style={styles.notFoundContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={iconColor} />
        <ThemedText style={styles.notFoundText}>
          {i18n.t("notFound")}
        </ThemedText>
      </ThemedView>
    );

  // Render
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Header
        title={post.title}
        leftIcon={<Entypo name="chevron-left" size={24} color={iconColor} />}
        rightIcon={
          <Menu
            visible={menuVisible}
            onDismiss={closeMenu}
            anchor={
              <TouchableOpacity onPress={openMenu}>
                <Ionicons
                  name="ellipsis-horizontal"
                  size={24}
                  color={iconColor}
                />
              </TouchableOpacity>
            }
            contentStyle={styles.menuContent}
          >
            <Menu.Item
              onPress={handleSharePost}
              title="Share Post"
              leadingIcon={() => (
                <Ionicons
                  name="share-social-outline"
                  size={24}
                  color={iconColor}
                />
              )}
            />
            <Divider />
            <Menu.Item
              onPress={handleOpenMaps}
              title="View on Maps"
              leadingIcon={() => (
                <Ionicons name="location-outline" size={24} color={iconColor} />
              )}
            />
            <Divider />
            <Menu.Item
              onPress={handleReport}
              title="Report Post"
              leadingIcon={() => (
                <Ionicons name="flag-outline" size={24} color={dangerColor} />
              )}
              titleStyle={{ color: dangerColor }}
            />
          </Menu>
        }
        onLeftPress={handleGoBack}
      />

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.containerContent}
        showsVerticalScrollIndicator={false}
      >
        {post.images?.[0]?.imageUrl && (
          <Image
            source={{ uri: post.images[0].imageUrl }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        )}

        <ThemedView style={styles.content}>
          <ThemedText style={styles.title}>{post.title}</ThemedText>

          <View style={styles.actionButtons}>
            {renderActionButton(
              "chatbubble-outline",
              i18n.t("messageSeller"),
              handleStartChat,
            )}
            {renderActionButton(
              isBookmarked ? "bookmark" : "bookmark-outline",
              isBookmarked ? i18n.t("saved") : i18n.t("save"),
              handleBookmarkToggle,
            )}
          </View>

          <Divider style={styles.divider} />

          <ThemedText style={styles.sectionTitle}>
            {i18n.t("description")}
          </ThemedText>
          <ThemedText style={styles.description}>{post.description}</ThemedText>

          <ThemedText style={styles.sectionTitle}>
            {i18n.t("contact")}
          </ThemedText>

          {post?.contact?.phoneNumber &&
            renderContactItem(
              "phone",
              i18n.t("phoneNumber"),
              post.contact.phoneNumber,
              handlePhonePress,
              handlePhoneLongPress,
            )}

          {post?.contact?.fullAddress &&
            renderContactItem(
              "map-marker",
              i18n.t("address"),
              post.contact.fullAddress,
              handleCopyAddress,
            )}
        </ThemedView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: distances.xl,
  },
  notFoundText: {
    fontSize: 18,
    fontFamily: typography.primary.medium,
    textAlign: "center",
    marginTop: distances.md,
  },
  scrollContainer: {
    flex: 1,
  },
  containerContent: {
    paddingBottom: scrollViewBottomGap,
  },
  heroImage: {
    width: SCREEN_WIDTH,
    height: IMAGE_HEIGHT,
  },
  content: {
    padding: distances.lg,
  },
  title: {
    fontSize: 24,
    fontFamily: typography.primary.bold,
    marginBottom: distances.md,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: distances.md,
    paddingHorizontal: distances.xl,
  },
  actionButton: {
    alignItems: "center",
    paddingVertical: distances.sm,
    minWidth: 100,
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: typography.secondary.medium,
    marginTop: distances.xxs,
  },
  divider: {
    marginVertical: distances.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: typography.primary.bold,
    marginBottom: distances.md,
  },
  description: {
    fontSize: 16,
    fontFamily: typography.secondary.regular,
    lineHeight: 24,
    marginBottom: distances.xl,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: distances.sm,
  },
  contactIcon: {
    marginRight: distances.md,
  },
  contactTextContainer: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    fontFamily: typography.secondary.medium,
    opacity: 0.7,
    marginBottom: distances.xxs,
  },
  contactValue: {
    fontSize: 16,
    fontFamily: typography.primary.medium,
  },
  menuContent: {
    borderRadius: 8,
    marginTop: distances.sm,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: distances.md,
  },
  menuItemText: {
    marginLeft: distances.sm,
    fontSize: 16,
    fontFamily: typography.primary.medium,
  },
});

export default PostDetailScreen;
