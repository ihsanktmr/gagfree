import { useState } from "react";

import { Alert } from "react-native";

import { ItemDetails, PickupDetails } from "../screens/types";

const initialItemDetails: ItemDetails = {
  title: "",
  description: "",
  category: "",
  images: [],
};

const initialPickupDetails: PickupDetails = {
  location: {
    address: "",
    additionalInfo: "",
  },
  pickupTimes: [],
  contactMethod: "",
  contactDetails: "",
};

export const usePostForm = (onSuccess: () => void) => {
  const [itemDetails, setItemDetails] =
    useState<ItemDetails>(initialItemDetails);
  const [pickupDetails, setPickupDetails] =
    useState<PickupDetails>(initialPickupDetails);

  const validateBasicInfo = () => {
    if (!itemDetails.title.trim()) {
      Alert.alert("Error", "Please enter a title for your item");
      return false;
    }
    // ... rest of validation logic
    return true;
  };

  const validatePricing = () => {
    if (!pickupDetails.location.address.trim()) {
      Alert.alert("Error", "Please specify a pickup location");
      return false;
    }
    // ... rest of validation logic
    return true;
  };

  const submitProduct = async () => {
    try {
      // ... submission logic
      onSuccess();
      // Reset form
      setItemDetails(initialItemDetails);
      setPickupDetails(initialPickupDetails);
    } catch (error) {
      console.error("Error submitting product:", error);
      Alert.alert("Error", "Failed to post your item. Please try again.");
    }
  };

  return {
    itemDetails,
    setItemDetails,
    pickupDetails,
    setPickupDetails,
    validateBasicInfo,
    validatePricing,
    submitProduct,
  };
};
