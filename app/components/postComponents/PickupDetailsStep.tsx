import React, { useState } from "react";

import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { distances } from "app/aesthetic/distances";
import { useThemeColor } from "app/hooks/useThemeColor";
import { Platform } from "react-native";
import { ScrollView, StyleSheet, View } from "react-native";
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
  { label: "Select contact method", value: "" },
  { label: "In-App Chat", value: "chat" },
  { label: "Email", value: "email" },
  { label: "Phone", value: "phone" },
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

  const renderContactInput = () => {
    let keyboardType: "default" | "email-address" | "phone-pad" = "default";
    let placeholder = "Enter your preferred contact details";

    switch (contactMethod) {
      case "email":
        keyboardType = "email-address";
        placeholder = "Enter your email address";
        break;
      case "phone":
        keyboardType = "phone-pad";
        placeholder = "Enter your phone number";
        break;
      case "chat":
        placeholder = "Your username will be used for in-app chat";
        break;
    }

    return (
      <TextInput
        label="Contact Details"
        value={contactDetails}
        onChangeText={(value) => {
          setContactDetails(value);
          updateData({ contactDetails: value });
        }}
        mode="outlined"
        placeholder={placeholder}
        keyboardType={keyboardType}
        style={styles.input}
      />
    );
  };

  return (
    <ScrollView style={styles.container}>
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
                How would you like to be contacted?
              </ThemedText>
              <View
                style={[
                  styles.pickerWrapper,
                  {
                    backgroundColor: backgroundColor,
                    borderColor: "rgba(0,0,0,0.2)",
                  },
                ]}
              >
                <Picker
                  selectedValue={contactMethod}
                  onValueChange={(value) => {
                    setContactMethod(value);
                    setContactDetails("");
                    updateData({
                      contactMethod: value,
                      contactDetails: "",
                    });
                  }}
                  style={[
                    styles.picker,
                    {
                      color: textColor,
                      backgroundColor: backgroundColor,
                    },
                  ]}
                >
                  {contactMethods.map((method) => (
                    <Picker.Item
                      key={method.value}
                      label={method.label}
                      value={method.value}
                      color={textColor}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {contactMethod && contactMethod !== "" && (
              <View style={styles.contactDetailsContainer}>
                {renderContactInput()}
                <ThemedText style={styles.helperText}>
                  {contactMethod === "chat"
                    ? "Other users will be able to contact you through the app's messaging system"
                    : `We'll share this ${contactMethod} with the person who wants to pick up your item`}
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
});
