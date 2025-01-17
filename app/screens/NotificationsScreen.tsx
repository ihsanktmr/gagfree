import React from "react";

import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Header } from "app/components/common/Header";
import NotificationList from "app/components/lists/notification/NotificationList";
import { useThemeColor } from "app/hooks/useThemeColor";

const mockNotifications = [
  {
    id: "1",
    message: "Your post has been liked!",
    timestamp: "2025-01-16T10:00:00Z",
    iconName: "heart",
  },
  {
    id: "2",
    message: "You have a new follower!",
    timestamp: "2025-01-15T15:30:00Z",
    iconName: "person-add",
  },
];

export function NotificationsScreen() {
  const navigation = useNavigation();
  const iconColor = useThemeColor("icon");

  const handleGoBack = () => navigation.goBack();

  return (
    <>
      <Header
        title="Notifications"
        leftIcon={<Entypo name="chevron-left" size={24} color={iconColor} />}
        onLeftPress={handleGoBack}
      />
      <NotificationList notifications={mockNotifications} />;
    </>
  );
}
