import React, { useState } from "react";

import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { distances } from "app/aesthetic/distances";
import { useThemeColor } from "app/hooks/useThemeColor";
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

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
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

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.form}>
        <TextInput
          label="Pickup Address"
          value={address}
          onChangeText={(value) => {
            setAddress(value);
            updateData({ location: { address: value, additionalInfo } });
          }}
          mode="outlined"
          style={styles.input}
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
          style={styles.input}
        />

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            Available Pickup Times
          </ThemedText>
          <Button
            mode="outlined"
            onPress={() => setShowDatePicker(true)}
            style={styles.addButton}
          >
            Add Pickup Time
          </Button>

          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="datetime"
              //is24Hour={false}
              onChange={handleDateChange}
            />
          )}

          <View style={styles.chipContainer}>
            {pickupTimes.map((time, index) => (
              <Chip
                key={index}
                onClose={() => removePickupTime(index)}
                style={styles.chip}
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
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={contactMethod}
              onValueChange={(value) => {
                setContactMethod(value);
                updateData({ contactMethod: value });
              }}
              style={[styles.picker, { backgroundColor, color: textColor }]}
            >
              {contactMethods.map((method) => (
                <Picker.Item
                  key={method.value}
                  label={method.label}
                  value={method.value}
                />
              ))}
            </Picker>
          </View>

          <TextInput
            label="Contact Details"
            value={contactDetails}
            onChangeText={(value) => {
              setContactDetails(value);
              updateData({ contactDetails: value });
            }}
            mode="outlined"
            placeholder={
              contactMethod === "email"
                ? "Enter your email"
                : contactMethod === "phone"
                  ? "Enter your phone number"
                  : "Enter your preferred contact details"
            }
            style={styles.input}
          />
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
  },
  section: {
    marginBottom: distances.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: distances.sm,
  },
  pickerContainer: {
    marginBottom: distances.md,
    borderRadius: 4,
    overflow: "hidden",
  },
  picker: {
    height: 50,
  },
  addButton: {
    marginBottom: distances.md,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: distances.sm,
  },
  chip: {
    marginBottom: distances.sm,
  },
});
