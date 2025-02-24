import React from "react";

import { useThemeColor } from "app/hooks/useThemeColor";
import { format } from "date-fns";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

interface ProfileStatsProps {
  postsCount?: number;
  rating?: number;
  joinDate?: string;
}

export const ProfileStats = ({
  postsCount = 0,
  rating = 0,
  joinDate,
}: ProfileStatsProps) => {
  const textColor = useThemeColor("text");
  const secondaryColor = useThemeColor("text");

  return (
    <View style={styles.container}>
      <View style={styles.statItem}>
        <Text style={[styles.statValue, { color: textColor }]}>
          {postsCount}
        </Text>
        <Text style={[styles.statLabel, { color: secondaryColor }]}>Posts</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={[styles.statValue, { color: textColor }]}>
          {rating.toFixed(1)}
        </Text>
        <Text style={[styles.statLabel, { color: secondaryColor }]}>
          Rating
        </Text>
      </View>
      <View style={styles.statItem}>
        <Text style={[styles.statValue, { color: textColor }]}>
          {joinDate ? format(new Date(joinDate), "MMM yyyy") : "-"}
        </Text>
        <Text style={[styles.statLabel, { color: secondaryColor }]}>
          Joined
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 14,
    marginTop: 5,
  },
});
