import React, { useCallback } from "react";

import { useNavigation } from "@react-navigation/native";
import { distances } from "app/aesthetic/distances";
import { borderRadii } from "app/aesthetic/styleConstants";
import { typography } from "app/aesthetic/typography";
import { Icon, IoniconsName } from "app/components/common/Icon";
import { ThemedText } from "app/components/texts/ThemedText";
import { useThemeColor } from "app/hooks/useThemeColor";
import { i18n } from "app/language";
import { addBookmark, removeBookmark } from "app/redux/post/actions";
import { selectBookmarkedPosts } from "app/redux/post/selectors";
import { Post } from "app/redux/post/types";
import { format } from "date-fns";
import * as Haptics from "expo-haptics";
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Share,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CARD_MARGIN = distances.md * 2; // Left and right margins combined
const IMAGE_SIZE = 110;
const CONTENT_PADDING = distances.sm * 2; // Left and right padding combined
const CONTENT_WIDTH = SCREEN_WIDTH - CARD_MARGIN - IMAGE_SIZE - CONTENT_PADDING;

interface PostItemProps {
  item: Post;
  onPress: () => void;
}

const PostItem: React.FC<PostItemProps> = ({ item, onPress }) => {
  const navigation = useNavigation();

  const iconColor = useThemeColor("icon");
  const textColor = useThemeColor("text");
  const surfaceColor = useThemeColor("surface");
  const mainColor = useThemeColor("main");
  const blueColor = useThemeColor("blue");
  const dispatch = useDispatch();
  const bookmarkedPosts = useSelector(selectBookmarkedPosts);
  const isBookmarked = bookmarkedPosts.some((post) => post._id === item._id);

  // Animation value
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePress = useCallback(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onPress();
  }, [onPress]);

  const handleLongPress = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    Alert.alert(i18n.t("quickActions"), "", [
      {
        text: isBookmarked
          ? i18n.t("removeFromBookmarks")
          : i18n.t("addToBookmarks"),
        onPress: handleBookmarkToggle,
      },
      {
        text: i18n.t("share"),
        onPress: handleShare,
      },
      {
        text: i18n.t("report"),
        style: "destructive",
        onPress: handleReport,
      },
      {
        text: i18n.t("cancel"),
        style: "cancel",
      },
    ]);
  }, [isBookmarked, item]);

  const handleBookmarkToggle = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isBookmarked) {
      dispatch(removeBookmark(item._id));
    } else {
      dispatch(addBookmark(item));
    }
  }, [isBookmarked, item, dispatch]);

  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        message: `${item.title}\n\n${item.description}`,
        title: item.title,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  }, [item]);

  const handleReport = useCallback(() => {
    Alert.alert(i18n.t("reportPostTitle"), i18n.t("reportPostMessage"), [
      {
        text: i18n.t("cancel"),
        style: "cancel",
      },
      {
        text: i18n.t("report"),
        style: "destructive",
        onPress: () => {
          // Add report logic here
          console.log("Report post:", item._id);
        },
      },
    ]);
  }, [item._id]);

  const mainImage = item.images?.[0];
  const formattedDate = item.createdAt
    ? format(new Date(item.createdAt), "MMM dd, yyyy")
    : "";

  const renderActionButton = (
    iconName: IoniconsName,
    onPress: () => void,
    color: string,
  ) => (
    <TouchableOpacity
      onPress={onPress}
      style={styles.actionButton}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Icon type="ionicon" name={iconName} size={20} color={color} />
    </TouchableOpacity>
  );

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={handlePress}
        onLongPress={handleLongPress}
        style={[styles.container, { backgroundColor: surfaceColor }]}
        activeOpacity={0.7}
      >
        <View style={styles.imageWrapper}>
          {item.category && (
            <View
              style={[
                styles.categoryBadgeOverlay,
                { backgroundColor: mainColor },
              ]}
            >
              <ThemedText style={styles.categoryTextOverlay}>
                {item.category}
              </ThemedText>
            </View>
          )}
          <View style={styles.imageContainer}>
            {mainImage ? (
              <Image
                source={{ uri: mainImage.imageUrl }}
                style={styles.image}
                resizeMode="cover"
              />
            ) : (
              <View
                style={[
                  styles.placeholderImage,
                  { backgroundColor: iconColor },
                ]}
              >
                <Icon
                  type="ionicon"
                  name="image-outline"
                  size={24}
                  color={surfaceColor}
                />
              </View>
            )}
          </View>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <ThemedText
              style={[styles.title, { color: textColor }]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {item.title}
            </ThemedText>
            <View style={styles.actionButtons}>
              {renderActionButton(
                "chatbubble-outline",
                () =>
                  navigation.navigate("ChatDetail", {
                    chatId: `post_${item._id}`,
                    postId: item._id,
                    title: item.title,
                    otherUserId: item.userId,
                  }),
                blueColor,
              )}
              {renderActionButton(
                isBookmarked ? "heart" : "heart-outline",
                handleBookmarkToggle,
                isBookmarked ? mainColor : iconColor,
              )}
            </View>
          </View>

          <ThemedText
            style={[styles.description, { color: iconColor }]}
            numberOfLines={3}
            ellipsizeMode="tail"
          >
            {item.description}
          </ThemedText>

          <View style={styles.footer}>
            <View style={styles.footerContent}>
              {item.contact?.fullAddress && (
                <View style={styles.locationContainer}>
                  <View style={styles.locationIconContainer}>
                    <Icon
                      type="ionicon"
                      name="location-outline"
                      size={16}
                      color={blueColor}
                    />
                  </View>
                  <ThemedText
                    style={[styles.locationText, { color: iconColor }]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.contact.fullAddress}
                  </ThemedText>
                </View>
              )}
              <ThemedText style={[styles.date, { color: iconColor }]}>
                {formattedDate}
              </ThemedText>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: distances.md,
    marginVertical: distances.xs,
    borderRadius: borderRadii.medium,
    padding: distances.sm,
    borderWidth: 1,
    minHeight: IMAGE_SIZE + CONTENT_PADDING,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageWrapper: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    padding: 2, // For border effect
  },
  imageContainer: {
    flex: 1,
    borderRadius: borderRadii.medium,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f0f0f0", // Placeholder color while loading
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.5,
  },
  contentContainer: {
    flex: 1,
    marginLeft: distances.md,
    width: CONTENT_WIDTH,
    justifyContent: "space-between",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: distances.xs,
    minHeight: 24, // Ensure consistent height
  },
  title: {
    fontSize: 16,
    fontFamily: typography.primary.medium,
    flex: 1,
    marginRight: distances.xs,
    lineHeight: 20,
  },
  categoryBadgeOverlay: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: distances.xs,
    paddingVertical: 4,
    borderRadius: borderRadii.small,
    zIndex: 1,
  },
  categoryTextOverlay: {
    fontSize: 10,
    fontFamily: typography.secondary.medium,
    color: "#FFF",
  },
  description: {
    fontSize: 14,
    fontFamily: typography.secondary.regular,
    marginBottom: distances.xs,
    lineHeight: 18,
    minHeight: 36,
  },
  footer: {
    marginTop: "auto", // Pushes footer to bottom
    paddingTop: distances.xs,
  },
  footerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 20,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: distances.md,
    maxWidth: "80%", // Prevent overflow into date
  },
  locationIconContainer: {
    width: 16,
    height: 16,
    marginRight: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  locationText: {
    fontSize: 12,
    fontFamily: typography.secondary.regular,
    lineHeight: 16, // Match icon height
    flex: 1,
  },
  date: {
    fontSize: 12,
    fontFamily: typography.secondary.regular,
    lineHeight: 16, // Match location text
    marginLeft: "auto", // Push date to right
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: distances.xs,
    marginLeft: distances.sm,
  },
});

export default React.memo(PostItem);
