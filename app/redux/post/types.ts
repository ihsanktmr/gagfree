// Enum for post type (e.g., "Giveaway" or other potential types)
export enum PostType {
  Giveaway = 1, // Items to give away for free
}

// Represents an image associated with a post
export interface Image {
  imageUrl: string; // URL of the image
}

// Separate interfaces for better type safety
export interface Contact {
  phoneNumber?: string;
  name?: string;
  fullAddress?: string;
  latitude?: number;
  longitude?: number;
}

// Represents a single post for giving away items
export interface Post {
  _id: string; // Unique identifier for the post
  title: string; // Title of the post
  description: string; // Description of the post
  userId: string; // Add this field
  images?: Array<{ imageUrl: string }>;
  contact: Contact; // Use the Contact interface
  category?: string;
  createdAt?: string;
  postType: PostType; // Type of the post
}

// Represents the state of posts in the application
export interface PostsState {
  posts: Post[]; // All posts
  bookmarkedPosts: Post[]; // Bookmarked posts by the user
}
