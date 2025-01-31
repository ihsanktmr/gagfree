import React, { useEffect, useRef, useState } from "react";

import { useNavigation } from "@react-navigation/native";
import { mapCustomStyle, mapCustomStyleDark } from "app/appInfo";
import { FABButton } from "app/components/buttons/FABButton";
import { MapViewComponent } from "app/components/common/GFMapView";
import { ThemedView } from "app/components/containers/ThemedView";
import { InternetModal } from "app/components/modals/InternetModal";
import { SwiperTutorialModal } from "app/components/modals/SwiperAddModal";
import { ItemDetailsStep } from "app/components/postComponents/ItemDetailsStep";
import { PickupDetailsStep } from "app/components/postComponents/PickupDetailsStep";
import { ReviewStep } from "app/components/postComponents/ReviewStep";
import { useData } from "app/hooks/useData";
import { useThemeColor } from "app/hooks/useThemeColor";
import { Post } from "app/redux/post/types";
import { selectTheme } from "app/redux/theme/selectors";
import { isConnected, setupConnectivityListener } from "app/utils/netCheck";
import { Alert, StyleSheet } from "react-native";
import MapView, { Region } from "react-native-maps";
import { useSelector } from "react-redux";

export function PostsScreen() {
  const posts = useData();
  const { navigate } = useNavigation();
  const theme = useSelector(selectTheme);

  // Constants
  const MIN_ZOOM_DELTA = 0.008;
  const MAX_ZOOM_DELTA = 1.5;

  const initialRegion: Region = {
    latitude: 40.6782,
    longitude: -73.9442,
    latitudeDelta: MAX_ZOOM_DELTA,
    longitudeDelta: MAX_ZOOM_DELTA,
  };

  const productInputData = {
    title1: "Add Product Details",
    title2: "Upload Product Photos",
    slide1Text:
      "Enter a detailed description of your product to attract customers.",
    slide2Text: "Add clear and high-quality photos of the product.",
    func1: () => console.log("Product description action triggered"),
    func2: () => console.log("Photo upload action triggered"),
  };
  // State
  const [view, setView] = useState<"map" | "list">("map");
  const [region, setRegion] = useState<Region>(initialRegion);
  const [internetModalVisible, setInternetModalVisible] = useState(false);
  const [addProductModalVisible, setAddProductModalVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const mapViewRef = useRef<MapView | null>(null);

  const iconColor = useThemeColor("icon");
  const backgroundColor = useThemeColor("background");
  const mainColor = useThemeColor("main");
  const isViewMap = view === "map";
  const [itemDetails, setItemDetails] = useState<{
    title: string;
    description: string;
    category: string;
    images: string[];
  }>({
    title: "",
    description: "",
    category: "",
    images: [],
  });

  const [pickupDetails, setPickupDetails] = useState<{
    location: {
      address: string;
      additionalInfo: string;
    };
    pickupTimes: string[];
    contactMethod: string;
    contactDetails: string;
  }>({
    location: {
      address: "",
      additionalInfo: "",
    },
    pickupTimes: [],
    contactMethod: "",
    contactDetails: "",
  });

  const steps = [
    {
      title: "Step 1: Item Details",
      content:
        "Share what you're giving away! Please provide:\n\n" +
        "• A clear title for your item\n" +
        "• Detailed description (condition, size, etc.)\n" +
        "• Category (e.g., Furniture, Electronics)\n" +
        "• At least one clear photo\n\n" +
        "Good photos and descriptions help others know if the item suits their needs!",
      buttonText: "Continue to Location",
      onStepComplete: () => validateBasicInfo(),
    },
    {
      title: "Step 2: Pickup Details",
      content:
        "Let's coordinate the pickup:\n\n" +
        "• Set your pickup location\n" +
        "• Choose available pickup time slots\n" +
        "• Select how you'd like to be contacted\n\n" +
        "This helps ensure a smooth handoff of your item!",
      buttonText: "Review Details",
      onStepComplete: () => validatePricing(),
    },
    {
      title: "Step 3: Review & Post",
      content:
        "Almost done! Please review:\n\n" +
        "• Item information and photos\n" +
        "• Pickup location and times\n" +
        "• Contact preferences\n\n" +
        "Once you confirm, your item will be visible to others in your area!",
      buttonText: "Post Item",
      onStepComplete: () => submitProduct(),
    },
  ];
  // Effects
  useEffect(() => {
    const unsubscribe = setupConnectivityListener((connected) => {
      setInternetModalVisible(!connected);
    });
    return unsubscribe;
  }, []);

  // Handlers
  const retryConnection = async () => {
    try {
      await isConnected();
      setInternetModalVisible(false);
    } catch {
      setInternetModalVisible(true);
    }
  };

  const handleMarkerPress = (post: Post) => {
    if (mapViewRef.current) {
      mapViewRef.current.animateToRegion(
        {
          latitude: post.contact.latitude,
          longitude: post.contact.longitude,
          latitudeDelta: MIN_ZOOM_DELTA,
          longitudeDelta: MIN_ZOOM_DELTA,
        },
        1000,
      );
    }
  };

  const handlePress = (postId: string) => navigate("PostDetail", { postId });

  const handleFABPress = () => setAddProductModalVisible(true);

  const validateBasicInfo = () => {
    // Replace these with actual form values
    const title = "test";
    const description = "test";
    const category = "test";
    const images = [];

    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title for your item");
      return false;
    }

    if (!description.trim() || description.length < 20) {
      Alert.alert(
        "Error",
        "Please provide a detailed description (minimum 20 characters)",
      );
      return false;
    }

    if (!category) {
      Alert.alert("Error", "Please select a category");
      return false;
    }

    if (images.length === 0) {
      Alert.alert("Error", "Please add at least one image");
      return false;
    }

    return true;
  };

  const validatePricing = () => {
    // For giveaway items, we'll validate location and availability instead
    // Replace these with actual form values
    const location = {
      latitude: 0,
      longitude: 0,
      address: "",
    };
    const pickupTimes = [];
    const contactMethod = "";

    if (!location.address) {
      Alert.alert("Error", "Please specify a pickup location");
      return false;
    }

    if (pickupTimes.length === 0) {
      Alert.alert("Error", "Please specify at least one pickup time slot");
      return false;
    }

    if (!contactMethod) {
      Alert.alert("Error", "Please specify how you want to be contacted");
      return false;
    }

    return true;
  };

  const submitProduct = async () => {
    try {
      // Collect all the product data from your form/state
      const productData = {
        title: "", // Product name/title
        description: "", // Detailed description
        condition: "", // e.g., "New", "Like New", "Good", "Fair"
        category: "", // e.g., "Furniture", "Electronics", "Clothing"
        images: [], // Array of image URLs or image data
        location: {
          latitude: 0,
          longitude: 0,
          address: "", // Pick-up address
        },
        contact: {
          method: "", // Preferred contact method (e.g., "chat", "email", "phone")
          details: "", // Contact information
        },
        availability: {
          status: "available", // "available", "pending", "claimed"
          pickupTimes: [], // Array of available pickup time slots
        },
        metadata: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isActive: true,
        },
      };

      // Add your API call or storage logic here
      // await api.createProduct(productData);

      // Close the modal and reset form
      setAddProductModalVisible(false);
      // Reset your form state here

      // Show success message
      Alert.alert("Success", "Product has been successfully created");
    } catch (error) {
      Alert.alert("Error", "Failed to create product. Please try again.");
      console.error("Error submitting product:", error);
    }
  };

  const renderStepContent = (currentIndex: number) => {
    switch (currentIndex) {
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
    <ThemedView style={styles.mainContainer}>
      <MapViewComponent
        posts={posts}
        region={region}
        setRegion={setRegion}
        initialRegion={initialRegion}
        theme={{ currentTheme: theme, mainColor, iconColor, backgroundColor }}
        mapCustomStyle={mapCustomStyle}
        mapCustomStyleDark={mapCustomStyleDark}
        onMarkerPress={handleMarkerPress}
        onCalloutPress={handlePress}
      />

      <FABButton onPress={handleFABPress} icon="plus" />

      <InternetModal
        visible={internetModalVisible}
        onRetry={retryConnection}
        onDismiss={() => setInternetModalVisible(false)}
      />

      <SwiperTutorialModal
        visible={addProductModalVisible}
        onDismiss={() => setAddProductModalVisible(false)}
        steps={steps}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      >
        {renderStepContent(currentIndex)}
      </SwiperTutorialModal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bodyText: {
    // Add appropriate styles for the body text
  },
});
