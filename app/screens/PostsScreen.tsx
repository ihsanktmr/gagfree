import React, { useEffect, useMemo, useRef, useState } from "react";

import { useNavigation } from "@react-navigation/native";
import { distances } from "app/aesthetic/distances";
import { mapCustomStyle, mapCustomStyleDark } from "app/appInfo";
import { FABButton } from "app/components/buttons/FABButton";
import { MapViewComponent } from "app/components/common/GFMapView";
import { SearchHeader } from "app/components/common/SearchHeader";
import { ThemedView } from "app/components/containers/ThemedView";
import PostList from "app/components/lists/post/PostList";
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
import { IconButton } from "react-native-paper";
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
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const mapViewRef = useRef<MapView | null>(null);
  const swiperRef = useRef<any>(null);

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

  // Filter posts based on search query
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) {
      return posts;
    }

    const searchTerms = searchQuery.toLowerCase().trim().split(" ");

    return posts.filter((post) => {
      const searchableText = [post.title, post.description, post.category]
        .join(" ")
        .toLowerCase();

      return searchTerms.every((term) => searchableText.includes(term));
    });
  }, [posts, searchQuery]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

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

  const handleSearchPress = () => {
    if (view === "list") {
      setShowSearch(true);
    }
  };

  const handleSearchClose = () => {
    setShowSearch(false);
    setSearchQuery("");
  };

  const validateBasicInfo = () => {
    if (!itemDetails.title.trim()) {
      Alert.alert("Error", "Please enter a title for your item");
      return false;
    }

    if (!itemDetails.description.trim()) {
      Alert.alert("Error", "Please provide a description");
      return false;
    }

    if (itemDetails.description.length < 20) {
      Alert.alert(
        "Error",
        "Please provide a more detailed description (minimum 20 characters)",
      );
      return false;
    }

    if (!itemDetails.category) {
      Alert.alert("Error", "Please select a category");
      return false;
    }

    if (itemDetails.images.length === 0) {
      Alert.alert("Error", "Please add at least one image");
      return false;
    }

    // If all validations pass
    swiperRef.current?.scrollBy(1);
    setCurrentIndex(1);
    return true;
  };

  const validatePricing = () => {
    if (!pickupDetails.location.address.trim()) {
      Alert.alert("Error", "Please specify a pickup location");
      return false;
    }

    if (pickupDetails.pickupTimes.length === 0) {
      Alert.alert("Error", "Please specify at least one pickup time");
      return false;
    }

    if (!pickupDetails.contactMethod) {
      Alert.alert("Error", "Please specify how you want to be contacted");
      return false;
    }

    if (!pickupDetails.contactDetails.trim()) {
      Alert.alert("Error", "Please provide your contact details");
      return false;
    }

    // Validate contact details format based on method
    if (pickupDetails.contactMethod === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(pickupDetails.contactDetails)) {
        Alert.alert("Error", "Please enter a valid email address");
        return false;
      }
    } else if (pickupDetails.contactMethod === "phone") {
      const phoneRegex = /^\+?[\d\s-]{10,}$/;
      if (!phoneRegex.test(pickupDetails.contactDetails)) {
        Alert.alert("Error", "Please enter a valid phone number");
        return false;
      }
    }

    // If all validations pass
    swiperRef.current?.scrollBy(1);
    setCurrentIndex(2);
    return true;
  };

  const submitProduct = async () => {
    try {
      // Collect all the product data from form state
      const productData = {
        title: itemDetails.title,
        description: itemDetails.description,
        condition: "Good", // Default condition for now
        category: itemDetails.category,
        images:
          itemDetails.images.length > 0
            ? itemDetails.images
            : [
                // Default test image - replace with your actual default image URL
                "https://via.placeholder.com/300",
              ],
        location: {
          // For testing, using initial region if no specific location is set
          latitude: pickupDetails.location.latitude || initialRegion.latitude,
          longitude:
            pickupDetails.location.longitude || initialRegion.longitude,
          address: pickupDetails.location.address,
          additionalInfo: pickupDetails.location.additionalInfo,
        },
        contact: {
          method: pickupDetails.contactMethod,
          details: pickupDetails.contactDetails,
        },
        availability: {
          status: "available",
          pickupTimes: pickupDetails.pickupTimes,
        },
        metadata: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isActive: true,
          userId: "test-user-id", // Replace with actual user ID from auth
        },
      };

      // Validate required fields before submission
      if (
        !productData.title ||
        !productData.description ||
        !productData.category
      ) {
        Alert.alert(
          "Missing Information",
          "Please fill in all required fields before posting.",
        );
        return;
      }

      if (
        !productData.location.address ||
        productData.availability.pickupTimes.length === 0
      ) {
        Alert.alert(
          "Missing Pickup Details",
          "Please provide pickup location and available times.",
        );
        return;
      }

      // TODO: Add your API call here
      // await api.createProduct(productData);
      console.log("Submitting product:", productData);

      // Reset all form state
      setItemDetails({
        title: "",
        description: "",
        category: "",
        images: [],
      });

      setPickupDetails({
        location: {
          address: "",
          additionalInfo: "",
        },
        pickupTimes: [],
        contactMethod: "",
        contactDetails: "",
      });

      // Close modal and show success message
      setAddProductModalVisible(false);
      setCurrentIndex(0); // Reset to first step for next time

      Alert.alert("Success!", "Your item has been successfully posted.", [
        {
          text: "OK",
          onPress: () => {
            // Optional: Navigate to the user's posts or refresh the map
            // navigate('UserPosts');
          },
        },
      ]);
    } catch (error) {
      console.error("Error submitting product:", error);
      Alert.alert("Error", "Failed to post your item. Please try again.", [
        {
          text: "OK",
          style: "cancel",
        },
      ]);
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
      <SearchHeader
        title="Posts"
        showSearch={showSearch}
        onSearchPress={handleSearchPress}
        onSearchClose={handleSearchClose}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        hideSearchIcon={view === "map"}
        placeholder="Search by title, description..."
        rightIcon={
          <IconButton
            icon={isViewMap ? "view-list" : "map"}
            iconColor={iconColor}
            onPress={() => {
              setView(isViewMap ? "list" : "map");
              if (showSearch) {
                handleSearchClose();
              }
            }}
          />
        }
      />

      {isViewMap ? (
        <MapViewComponent
          posts={filteredPosts}
          region={region}
          setRegion={setRegion}
          initialRegion={initialRegion}
          theme={{ currentTheme: theme, mainColor, iconColor, backgroundColor }}
          mapCustomStyle={mapCustomStyle}
          mapCustomStyleDark={mapCustomStyleDark}
          onMarkerPress={handleMarkerPress}
          onCalloutPress={handlePress}
        />
      ) : (
        <PostList postData={filteredPosts} />
      )}

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
        ref={swiperRef}
      >
        {renderStepContent(currentIndex)}
      </SwiperTutorialModal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingTop: distances.md,
  },
});
