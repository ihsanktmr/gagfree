// Enum for post type (e.g., "Giveaway" or other potential types)
export enum PostType {
  Giveaway = 1, // Items to give away for free
}

// Represents an image associated with a post
export interface Image {
  imageUrl: string; // URL of the image
}

// Represents the contact details of the giver
export interface Contact {
  phoneNumber: string; // Phone number
  name: string; // Name of the contact person
  fullAddress: string; // Full address as a single string
  latitude: number; // Latitude of the location
  longitude: number; // Longitude of the location
}

// Represents a single post for giving away items
export interface Post {
  _id: string; // Unique identifier for the post
  title: string; // Title of the post
  contact: Contact; // Contact details
  description: string; // Description of the post
  images: Image[]; // List of images associated with the post
  postType: PostType; // Type of the post
}

// Represents the state of posts in the application
export interface PostsState {
  posts: Post[]; // All posts
  bookmarkedPosts: Post[]; // Bookmarked posts by the user
}
