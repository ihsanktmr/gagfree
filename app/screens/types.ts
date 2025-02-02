import { Region } from "react-native-maps";

export interface ItemDetails {
  title: string;
  description: string;
  category: string;
  images: string[];
}

export interface PickupDetails {
  location: {
    address: string;
    additionalInfo: string;
    latitude?: number;
    longitude?: number;
  };
  pickupTimes: string[];
  contactMethod: string;
  contactDetails: string;
}

export interface Step {
  title: string;
  content: string;
  buttonText: string;
  onStepComplete: () => boolean;
}

export interface PostsScreenProps {
  initialRegion: Region;
}
