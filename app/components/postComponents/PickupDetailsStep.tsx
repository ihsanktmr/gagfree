import React, { useState } from "react";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { distances } from "app/aesthetic/distances";
import { typography } from "app/aesthetic/typography";
import { useThemeColor } from "app/hooks/useThemeColor";
import { Platform } from "react-native";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Chip, TextInput } from "react-native-paper";

import { ThemedView } from "../containers/ThemedView";
import { ThemedText } from "../texts/ThemedText";

interface PickupDetailsStepProps {
  onUpdateData: (data: {
    location: {
      address: string;
      additionalInfo: string;
    };
    pickupTimes: string[];
    contactMethod: string;
    contactDetails: string;
  }) => void;
  initialData?: {
    location: {
      address: string;
      additionalInfo: string;
    };
    pickupTimes: string[];
    contactMethod: string;
    contactDetails: string;
  };
}

const contactMethods = [
  {
    id: "in-app",
    label: "In-App Chat",
    icon: "chat-processing",
    placeholder: "Use in-app messaging",
    keyboardType: "default",
    isInApp: true,
    description: "Chat directly within the app",
  },
  {
    id: "phone",
    label: "Phone",
    icon: "phone",
    placeholder: "Enter phone number",
    keyboardType: "phone-pad",
    validation: /^\+?[\d\s-]{10,}$/,
    errorMessage: "Please enter a valid phone number",
    description: "Share your phone number",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    icon: "whatsapp",
    placeholder: "Enter WhatsApp number",
    keyboardType: "phone-pad",
    validation: /^\+?[\d\s-]{10,}$/,
    errorMessage: "Please enter a valid WhatsApp number",
    description: "Connect via WhatsApp",
  },
  {
    id: "telegram",
    label: "Telegram",
    icon: "telegram",
    placeholder: "Enter Telegram username",
    keyboardType: "default",
    validation: /^@?[a-zA-Z0-9_]{5,32}$/,
    errorMessage: "Please enter a valid Telegram username",
    description: "Connect on Telegram",
  },
  {
    id: "email",
    label: "Email",
    icon: "email",
    placeholder: "Enter email address",
    keyboardType: "email-address",
    validation: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    errorMessage: "Please enter a valid email address",
    description: "Communicate via email",
  },
];

export const PickupDetailsStep: React.FC<PickupDetailsStepProps> = ({
  onUpdateData,
  initialData,
}) => {
  const [address, setAddress] = useState(initialData?.location.address || "");
  const [additionalInfo, setAdditionalInfo] = useState(
    initialData?.location.additionalInfo || "",
  );
  const [pickupTimes, setPickupTimes] = useState<string[]>(
    initialData?.pickupTimes || [],
  );
  const [contactMethod, setContactMethod] = useState(
    initialData?.contactMethod || "",
  );
  const [contactDetails, setContactDetails] = useState(
    initialData?.contactDetails || "",
  );

  // Date picker states
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const backgroundColor = useThemeColor("background");
  const textColor = useThemeColor("text");
  const surfaceColor = useThemeColor("icon");
  const mainColor = useThemeColor("main");

  const [contactError, setContactError] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (event.type === "dismissed") {
      setShowDatePicker(false);
      return;
    }

    if (date) {
      setSelectedDate(date);
      const timeString = date.toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
      if (!pickupTimes.includes(timeString)) {
        const newPickupTimes = [...pickupTimes, timeString];
        setPickupTimes(newPickupTimes);
        updateData({ pickupTimes: newPickupTimes });
      }
    }
  };

  const removePickupTime = (index: number) => {
    const newPickupTimes = pickupTimes.filter((_, i) => i !== index);
    setPickupTimes(newPickupTimes);
    updateData({ pickupTimes: newPickupTimes });
  };

  const updateData = (
    partialData: Partial<PickupDetailsStepProps["initialData"]>,
  ) => {
    onUpdateData({
      location: {
        address,
        additionalInfo,
      },
      pickupTimes,
      contactMethod,
      contactDetails,
      ...partialData,
    });
  };

  const showPicker = () => {
    setShowDatePicker(true);
  };

  const validateContact = (text: string) => {
    const method = contactMethods.find((m) => m.id === contactMethod);
    if (!method) return;

    if (text && !method.validation.test(text)) {
      setContactError(method.errorMessage);
    } else {
      setContactError("");
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ThemedView style={styles.form}>
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Location Details</ThemedText>
          <TextInput
            label="Pickup Address"
            value={address}
            onChangeText={(value) => {
              setAddress(value);
              updateData({ location: { address: value, additionalInfo } });
            }}
            mode="outlined"
            style={styles.input}
            placeholder="Enter the pickup address"
            left={<TextInput.Icon icon="map-marker" />}
          />

          <TextInput
            label="Additional Location Info"
            value={additionalInfo}
            onChangeText={(value) => {
              setAdditionalInfo(value);
              updateData({ location: { address, additionalInfo: value } });
            }}
            mode="outlined"
            placeholder="E.g., Building entrance, parking instructions"
            multiline
            numberOfLines={2}
            style={styles.input}
            left={<TextInput.Icon icon="information" />}
          />
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            Available Pickup Times
          </ThemedText>
          <Button
            mode="outlined"
            onPress={showPicker}
            style={styles.addButton}
            icon="clock"
            contentStyle={styles.buttonContent}
          >
            Add Pickup Time
          </Button>

          {showDatePicker && (
            <>
              <DateTimePicker
                value={selectedDate}
                mode="datetime"
                is24Hour={false}
                onChange={handleDateChange}
                display={Platform.OS === "ios" ? "spinner" : "default"}
                style={Platform.OS === "ios" ? styles.iosDatePicker : undefined}
                minimumDate={new Date()}
              />

              {Platform.OS === "ios" && (
                <View style={styles.iosButtonContainer}>
                  <Button
                    mode="outlined"
                    onPress={() => setShowDatePicker(false)}
                    style={styles.iosButton}
                  >
                    Cancel
                  </Button>
                  <Button
                    mode="contained"
                    onPress={() => {
                      handleDateChange({ type: "set" }, selectedDate);
                      setShowDatePicker(false);
                    }}
                    style={styles.iosButton}
                  >
                    Add Time
                  </Button>
                </View>
              )}
            </>
          )}

          <View style={styles.chipContainer}>
            {pickupTimes.map((time, index) => (
              <Chip
                key={index}
                onClose={() => removePickupTime(index)}
                style={styles.chip}
                icon="clock-outline"
                elevation={2}
              >
                {time}
              </Chip>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            Contact Preferences
          </ThemedText>

          <ThemedView
            style={[styles.contactSection, { backgroundColor: surfaceColor }]}
          >
            <View style={styles.pickerContainer}>
              <ThemedText style={styles.pickerLabel}>
                Preferred Contact Method
              </ThemedText>
              <View style={styles.contactMethodGrid}>
                {contactMethods.map((method) => (
                  <TouchableOpacity
                    key={method.id}
                    style={[
                      styles.contactMethodCard,
                      contactMethod === method.id && styles.selectedCard,
                      { borderColor: mainColor },
                    ]}
                    onPress={() => {
                      setContactMethod(method.id);
                      if (method.isInApp) {
                        setContactDetails("in-app-chat");
                      } else {
                        setContactDetails("");
                      }
                      setContactError("");
                      updateData({
                        contactMethod: method.id,
                        contactDetails: method.isInApp ? "in-app-chat" : "",
                      });
                    }}
                  >
                    <MaterialCommunityIcons
                      name={method.icon}
                      size={24}
                      color={
                        contactMethod === method.id ? mainColor : textColor
                      }
                    />
                    <ThemedText
                      style={[
                        styles.contactMethodLabel,
                        contactMethod === method.id && { color: mainColor },
                      ]}
                    >
                      {method.label}
                    </ThemedText>
                    <ThemedText style={styles.methodDescription}>
                      {method.description}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {contactMethod &&
              !contactMethods.find((m) => m.id === contactMethod)?.isInApp && (
                <View style={styles.contactInputContainer}>
                  <TextInput
                    mode="outlined"
                    value={contactDetails}
                    onChangeText={(text) => {
                      setContactDetails(text);
                      validateContact(text);
                      updateData({ contactDetails: text });
                    }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => {
                      setIsFocused(false);
                      validateContact(contactDetails);
                    }}
                    placeholder={
                      contactMethods.find((m) => m.id === contactMethod)
                        ?.placeholder
                    }
                    keyboardType={
                      contactMethods.find((m) => m.id === contactMethod)
                        ?.keyboardType
                    }
                    style={[
                      styles.input,
                      styles.marginTop,
                      isFocused && styles.focusedInput,
                    ]}
                    error={!!contactError}
                  />
                  {contactError ? (
                    <ThemedText style={styles.errorText}>
                      {contactError}
                    </ThemedText>
                  ) : (
                    <ThemedText style={styles.helperText}>
                      This will be shared with interested people
                    </ThemedText>
                  )}
                </View>
              )}

            {contactMethod === "in-app" && (
              <View style={styles.inAppMessageContainer}>
                <MaterialCommunityIcons
                  name="check-circle"
                  size={24}
                  color={mainColor}
                />
                <ThemedText style={styles.inAppMessage}>
                  People will be able to contact you directly through the app's
                  messaging system
                </ThemedText>
              </View>
            )}
          </ThemedView>
        </View>
      </ThemedView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    padding: distances.md,
  },
  input: {
    marginBottom: distances.md,
    fontSize: 16,
  },
  section: {
    marginBottom: distances.xl,
    backgroundColor: "transparent",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: distances.md,
    paddingHorizontal: distances.xs,
  },
  pickerContainer: {
    marginBottom: distances.lg,
  },
  pickerWrapper: {
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    height: 56,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: distances.md,
    fontWeight: "500",
    paddingHorizontal: distances.xs,
  },
  picker: {
    height: 56,
    width: "100%",
    fontSize: 16,
  },
  addButton: {
    marginBottom: distances.md,
    height: 48,
  },
  buttonContent: {
    height: 48,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: distances.md,
  },
  chip: {
    marginBottom: distances.sm,
    height: 36,
  },
  iosDatePicker: {
    width: "100%",
    height: 200,
    marginBottom: distances.sm,
  },
  iosButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: distances.md,
    gap: distances.md,
  },
  iosButton: {
    flex: 1,
    height: 48,
  },
  contactSection: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: distances.sm,
    padding: distances.lg,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  contactDetailsContainer: {
    marginTop: distances.md,
  },
  helperText: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: distances.sm,
    marginHorizontal: distances.xs,
    lineHeight: 20,
  },
  contactMethodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: distances.sm,
    marginTop: distances.sm,
  },
  contactMethodCard: {
    width: "47%",
    padding: distances.md,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    marginBottom: distances.xs,
    minHeight: 120,
  },
  selectedCard: {
    borderWidth: 2,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  contactMethodLabel: {
    marginTop: distances.xs,
    fontSize: 14,
    fontFamily: typography.primary.bold,
  },
  contactInputContainer: {
    marginTop: distances.md,
  },
  focusedInput: {
    borderColor: "red",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  marginTop: {
    marginTop: distances.md,
  },
  methodDescription: {
    fontSize: 12,
    textAlign: "center",
    marginTop: distances.xs,
    opacity: 0.7,
  },
  inAppMessageContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    padding: distances.md,
    borderRadius: 12,
    marginTop: distances.md,
  },
  inAppMessage: {
    flex: 1,
    marginLeft: distances.sm,
    fontSize: 14,
    lineHeight: 20,
  },
});
