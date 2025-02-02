import React, { useRef } from "react";

import { distances } from "app/aesthetic/distances";
import { typography } from "app/aesthetic/typography";
import { ThemedView } from "app/components/containers/ThemedView";
import { ThemedText } from "app/components/texts/ThemedText";
import { useThemeColor } from "app/hooks/useThemeColor";
import { deleteChat } from "app/redux/chat/actions";
import { Chat } from "app/redux/chat/types";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";
import { Image } from "react-native";
import { Badge, IconButton } from "react-native-paper";
import { SwipeRow } from "react-native-swipe-list-view";
import { useDispatch } from "react-redux";

interface ChatComponentProps {
  chat: Chat;
  onPress: (chatId: string) => void;
  onArchive?: (chatId: string) => void;
  onUnarchive?: (chatId: string) => void;
}

const ChatComponent: React.FC<ChatComponentProps> = ({
  chat,
  onPress,
  onArchive,
  onUnarchive,
}) => {
  const dispatch = useDispatch();
  const textColor = useThemeColor("text");
  const mainColor = useThemeColor("main");
  const surfaceColor = useThemeColor("surface");
  const rowRef = useRef<SwipeRow<any>>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const formattedTimestamp = new Date(chat.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleDelete = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      dispatch(deleteChat(chat.id));
    });
  };

  const handleArchive = () => {
    // Same fade out animation as delete
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      if (chat.isArchived) {
        onUnarchive?.(chat.id);
      } else {
        onArchive?.(chat.id);
      }
      rowRef.current?.closeRow();
      // Reset opacity for next render
      fadeAnim.setValue(1);
    });
  };

  const renderHiddenItem = () => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[
          styles.actionButton,
          styles.archiveBtn,
          { backgroundColor: chat.isArchived ? mainColor : "#8e8e8e" },
        ]}
        onPress={handleArchive}
      >
        <View style={styles.actionContent}>
          <IconButton
            icon={chat.isArchived ? "inbox" : "archive"}
            size={24}
            iconColor="white"
          />
          <ThemedText style={styles.actionText}>
            {chat.isArchived ? "Unarchive" : "Archive"}
          </ThemedText>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.actionButton, styles.deleteBtn]}
        onPress={handleDelete}
      >
        <View style={styles.actionContent}>
          <IconButton icon="delete" size={24} iconColor="white" />
          <ThemedText style={styles.actionText}>Delete</ThemedText>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <SwipeRow
      ref={rowRef}
      leftOpenValue={75}
      rightOpenValue={-150}
      stopLeftSwipe={75}
      stopRightSwipe={-150}
      previewRowKey={chat.id}
      previewOpenValue={-40}
      previewOpenDelay={1000}
      useNativeDriver={true}
    >
      {renderHiddenItem()}
      <Animated.View
        style={[
          styles.rowFront,
          {
            opacity: fadeAnim,
            backgroundColor: surfaceColor,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => onPress(chat.id)}
          activeOpacity={0.7}
          style={[styles.chatItem, { backgroundColor: surfaceColor }]}
        >
          <View style={styles.avatarContainer}>
            <Image source={{ uri: chat.avatarUrl }} style={styles.avatar} />
            {chat.isOnline && (
              <View
                style={[styles.onlineIndicator, { backgroundColor: mainColor }]}
              />
            )}
          </View>

          <ThemedView style={styles.chatDetails}>
            <View style={styles.headerRow}>
              <ThemedText style={styles.title}>{chat.title}</ThemedText>
              <ThemedText style={[styles.timestamp, { color: textColor }]}>
                {formattedTimestamp}
              </ThemedText>
            </View>

            <View style={styles.messageRow}>
              <ThemedText
                numberOfLines={1}
                style={[
                  styles.lastMessage,
                  chat.unreadCount ? styles.unreadMessage : null,
                ]}
              >
                {chat.lastMessage}
              </ThemedText>
              {chat.unreadCount ? (
                <Badge
                  size={20}
                  style={[styles.badge, { backgroundColor: mainColor }]}
                >
                  {chat.unreadCount}
                </Badge>
              ) : null}
            </View>
          </ThemedView>
        </TouchableOpacity>
      </Animated.View>
    </SwipeRow>
  );
};

const styles = StyleSheet.create({
  rowFront: {
    borderBottomWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  rowBack: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: distances.md,
  },
  avatarContainer: {
    position: "relative",
    marginRight: distances.md,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "white",
  },
  chatDetails: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  messageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontFamily: typography.primary.bold,
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    fontFamily: typography.secondary.regular,
    color: "gray",
    marginRight: distances.sm,
  },
  unreadMessage: {
    fontFamily: typography.secondary.regular,
    color: "black",
  },
  timestamp: {
    fontSize: 12,
    fontFamily: typography.secondary.regular,
  },
  badge: {
    marginLeft: distances.xs,
  },
  actionButton: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    position: "relative",
    top: 0,
    width: 75,
    height: "100%",
  },
  actionContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: {
    color: "white",
    fontSize: 12,
    marginTop: -8,
  },
  archiveBtn: {
    backgroundColor: "#8e8e8e",
  },
  deleteBtn: {
    backgroundColor: "#ff4444",
  },
});

export default ChatComponent;
