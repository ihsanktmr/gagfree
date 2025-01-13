import React, { useState } from "react";

import { Entypo, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
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
import { useLanguage } from "app/providers/LanguageProvider";
import { useSnackbar } from "app/providers/SnackbarProvider";
import { addBookmark, removeBookmark } from "app/redux/post/actions";
import { selectBookmarkedPosts } from "app/redux/post/selectors";
import { Post } from "app/redux/post/types";
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
  const route = useRoute();
  const { goBack } = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);

  const { showSnackbar } = useSnackbar();

  const iconColor = useThemeColor("icon");
  const backgroundColor = useThemeColor("background");
  const blueColor = useThemeColor("blue");

  const { postId } = route.params;
  const posts = useData();

  const post = posts.find((item: Post) => item._id === postId);

  const { _id, title, contact, description, images, postType } = post;

  const dispatch = useDispatch();
  const { language } = useLanguage();

  const bookmarkedposts = useSelector(selectBookmarkedPosts);
  const isBookmarked = bookmarkedposts.some((item) => item._id === post._id);

  const handleLeftPress = () => {
    goBack();
  };

  const handleRightPress = () => {
    openMenu();
  };

  const toggleBookmark = () => {
    if (isBookmarked) {
      dispatch(removeBookmark(post._id));
      showSnackbar(i18n.t("removedFromBookmarks"), i18n.t("okay"), () => {
        console.log("Undo action pressed");
      });
    } else {
      dispatch(addBookmark(post));
      showSnackbar(i18n.t("savedToBookmarks"), i18n.t("okay"), () => {
        console.log("Undo action pressed");
      });
    }

    setTimeout(() => closeMenu(), 500);
  };

  const sharePostOnPress = () => {
    sharePost({ title: title });
    closeMenu();
  };

  const copyToAddressClipboard = () => {
    Clipboard.setStringAsync(title + " " + contact.fullAddress);
    showSnackbar(i18n.t("addressCopied"), i18n.t("okay"), () => {
      console.log("Undo action pressed");
    });
  };

  const handlePhoneOnPress = () => {
    Linking.openURL(`tel:0${contact.phoneNumber}`);
  };

  const handlePhoneOnLongPress = () => {
    Clipboard.setStringAsync("0" + contact.phoneNumber);
    showSnackbar(i18n.t("phoneNumberCopied"), i18n.t("okay"), () => {
      console.log("Undo action pressed");
    });
  };

  const openMenu = () => setMenuVisible(true);

  const closeMenu = () => setMenuVisible(false);

  const renderContact = () => {
    if (false) {
      return;
    }
    return (
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>{i18n.t("contact")}</ThemedText>
        {contact.phoneNumber && (
          <TouchableOpacity
            onLongPress={handlePhoneOnLongPress}
            onPress={handlePhoneOnPress}
          >
            <ThemedText style={styles.contactItem}>
              {i18n.t("phoneNumber") + `: `}
              <Text style={{ ...styles.contactItemBlue, color: blueColor }}>
                {contact.phoneNumber}
              </Text>
            </ThemedText>
          </TouchableOpacity>
        )}
      </ThemedView>
    );
  };

  if (!post) {
    return <Text>{i18n.t("notFound")}</Text>;
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ ...styles.scrollContainer, backgroundColor }}
      contentContainerStyle={styles.containerContent}
    >
      <Header
        title={post.title}
        leftIcon={<Entypo name="chevron-left" size={24} color={iconColor} />}
        rightIcon={
          <Menu
            style={{ marginRight: distances.sm }}
            visible={menuVisible}
            onDismiss={closeMenu}
            anchor={
              <TouchableOpacity onPress={openMenu}>
                <Ionicons name="menu" size={24} color={iconColor} />
              </TouchableOpacity>
            }
          >
            <TouchableOpacity
              style={{ padding: distances.md }}
              onPress={sharePostOnPress}
            >
              <Ionicons
                name="share-social-outline"
                size={24}
                color={iconColor}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ padding: distances.md }}
              onPress={toggleBookmark}
            >
              <Ionicons
                name={isBookmarked ? "bookmark" : "bookmark-outline"}
                size={24}
                color={iconColor}
              />
            </TouchableOpacity>
          </Menu>
        }
        onLeftPress={handleLeftPress}
        onRightPress={handleRightPress}
      />

      <ThemedView style={styles.content}>
        {images && images[0].imageUrl && (
          <>
            <Image
              source={{ uri: images[0].imageUrl }}
              style={styles.imageBig}
              resizeMode={"stretch"}
            />
          </>
        )}

        <ThemedView style={styles.postHeadline}>
          {images && images[0].imageUrl && (
            <Image
              source={{ uri: images[0].imageUrl }}
              style={styles.image}
              resizeMode={"stretch"}
            />
          )}
          <ThemedView style={styles.postDetailOverviewContainer}>
            <ThemedText style={styles.sectionName}>{post.title}</ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={{ flexDirection: "row", alignItems: "center" }}>
          <ThemedText
            style={{ ...styles.sectionTitle, marginRight: distances.sm }}
          >
            {i18n.t("description")}
          </ThemedText>
        </ThemedView>
        <ThemedText style={styles.description}>{description}</ThemedText>

        {renderContact()}
        <TouchableOpacity
          onLongPress={copyToAddressClipboard}
          onPress={copyToAddressClipboard}
        >
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              {i18n.t("address")}
            </ThemedText>
            <ThemedText>{contact.fullAddress}</ThemedText>
          </ThemedView>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: distances.xs,
          }}
          onPress={() => null}
        >
          <ThemedText style={styles.contactItem}>
            {i18n.t("getDirections")}
          </ThemedText>

          <MaterialCommunityIcons
            name="directions"
            size={24}
            color={iconColor}
          />
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
};

let postLogoSize = 60;

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  containerContent: {
    paddingBottom: scrollViewBottomGap,
  },
  postHeadline: {
    paddingVertical: distances.sm,
    flexDirection: "row",
    alignItems: "center",
  },
  postDetailOverviewContainer: {
    flexDirection: "column",
    paddingHorizontal: distances.sm,
  },
  image: {
    height: postLogoSize,
    width: postLogoSize,
    borderRadius: postLogoSize / 2,
  },
  imageBig: {
    width: "100%",
    height: 200,
    borderRadius: postLogoSize / 2,
    marginTop: distances.md,
  },
  title: {
    fontSize: 24,
    fontFamily: typography.primary.bold,
  },
  description: {
    fontSize: 16,
    fontFamily: typography.secondary.regular,
    marginBottom: distances.md,
  },
  sectionName: {
    width: "75%",
    fontSize: 16,
    fontFamily: typography.primary.bold,
    marginBottom: distances.xxs,
  },
  sectionType: {
    fontSize: 14,
    fontFamily: typography.secondary.semiBold,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: typography.primary.bold,
    marginVertical: distances.md,
  },
  content: {
    zIndex: -1,
    paddingHorizontal: genericSpacing,
  },
  section: {
    marginBottom: distances.xs,
  },
  contactItemBlue: {
    fontSize: 15,
    fontFamily: typography.secondary.regular,
    textDecorationLine: "underline",
  },
  contactItem: {
    fontSize: 14,
    fontFamily: typography.primary.bold,
    marginRight: distances.xxs,
  },
  errorText: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: typography.secondary.regular,
    color: "red",
    marginTop: distances.md,
  },
  tooltipText: {
    width: "100%",
    fontSize: 8,
    fontFamily: typography.secondary.regular,
    textAlign: "center",
    marginTop: distances.xxs,
  },
  tooltipUnderlineText: {
    width: "100%",
    fontSize: 8,
    fontFamily: typography.secondary.regular,
    textDecorationLine: "underline",
  },
});

export default PostDetailScreen;
