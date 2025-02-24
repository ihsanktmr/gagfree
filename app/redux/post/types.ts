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
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  location: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  likes: number;
  user: {
    id: string;
    username: string;
    avatar?: string;
  };
}

// Represents the state of posts in the application
export interface PostsState {
  posts: Post[]; // All posts
  bookmarkedPosts: Post[]; // Bookmarked posts by the user
}
