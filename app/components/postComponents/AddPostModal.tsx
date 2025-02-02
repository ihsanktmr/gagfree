import React, { useRef } from "react";

import { ItemDetails, PickupDetails } from "app/screens/types";
import { StyleSheet, View } from "react-native";

import { SwiperTutorialModal } from "../modals/SwiperAddModal";
import { ItemDetailsStep } from "./ItemDetailsStep";
import { PickupDetailsStep } from "./PickupDetailsStep";
import { ReviewStep } from "./ReviewStep";

interface AddPostModalProps {
  visible: boolean;
  onDismiss: () => void;
  itemDetails: ItemDetails;
  pickupDetails: PickupDetails;
  setItemDetails: (details: ItemDetails) => void;
  setPickupDetails: (details: PickupDetails) => void;
  validateBasicInfo: () => boolean;
  validatePricing: () => boolean;
  submitProduct: () => Promise<void>;
}

export const AddPostModal: React.FC<AddPostModalProps> = ({
  visible,
  onDismiss,
  itemDetails,
  pickupDetails,
  setItemDetails,
  setPickupDetails,
  validateBasicInfo,
  validatePricing,
  submitProduct,
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const swiperRef = useRef<any>(null);

  const steps = [
    {
      title: "Step 1: Item Details",
      content: "Share what you're giving away!...",
      buttonText: "Continue to Location",
      onStepComplete: validateBasicInfo,
    },
    {
      title: "Step 2: Pickup Details",
      content: "Let's coordinate the pickup...",
      buttonText: "Review Details",
      onStepComplete: validatePricing,
    },
    {
      title: "Step 3: Review & Post",
      content: "Almost done! Please review...",
      buttonText: "Post Item",
      onStepComplete: submitProduct,
    },
  ];

  const renderStepContent = (index: number) => {
    switch (index) {
      case 0:
        return (
          <ItemDetailsStep
            onUpdateData={setItemDetails}
            initialData={itemDetails}
          />
        );
      case 1:
        return (
          <PickupDetailsStep
            onUpdateData={setPickupDetails}
            initialData={pickupDetails}
          />
        );
      case 2:
        return (
          <ReviewStep itemDetails={itemDetails} pickupDetails={pickupDetails} />
        );
      default:
        return null;
    }
  };

  return (
    <SwiperTutorialModal
      visible={visible}
      onDismiss={onDismiss}
      steps={steps}
      currentIndex={currentIndex}
      setCurrentIndex={setCurrentIndex}
      ref={swiperRef}
    >
      {renderStepContent(currentIndex)}
    </SwiperTutorialModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
