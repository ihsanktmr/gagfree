// haptics.ts
import * as Haptics from "expo-haptics";

/**
 * Provides haptic feedback for light interactions, such as button presses.
 */
export const triggerLightFeedback = async () => {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch (error) {
    console.error("Haptic Light Feedback Error:", error);
  }
};

/**
 * Provides haptic feedback for medium interactions, such as segmented button changes.
 */
export const triggerMediumFeedback = async () => {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch (error) {
    console.error("Haptic Medium Feedback Error:", error);
  }
};

/**
 * Provides haptic feedback for heavy interactions, such as significant action completions.
 */
export const triggerHeavyFeedback = async () => {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  } catch (error) {
    console.error("Haptic Heavy Feedback Error:", error);
  }
};

/**
 * Provides notification feedback for events like success, warning, or error.
 * @param type - The type of notification feedback (success, warning, or error).
 */
export const triggerNotificationFeedback = async (
  type: "success" | "warning" | "error",
) => {
  try {
    switch (type) {
      case "success":
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success,
        );
        break;
      case "warning":
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Warning,
        );
        break;
      case "error":
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
      default:
        console.warn("Invalid notification feedback type:", type);
    }
  } catch (error) {
    console.error("Haptic Notification Feedback Error:", error);
  }
};

/**
 * Triggers a selection change feedback, ideal for UI interactions like segmented control changes.
 */
export const triggerSelectionChangeFeedback = async () => {
  try {
    await Haptics.selectionAsync();
  } catch (error) {
    console.error("Haptic Selection Feedback Error:", error);
  }
};
