import { Document } from 'mongoose';

export interface UserDocument extends Document {
  id: string;
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  role: 'USER' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
}

export interface ItemDocument extends Document {
  id: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  status: 'AVAILABLE' | 'PENDING' | 'GIVEN' | 'DELETED';
  location?: string;
  owner: UserDocument | string;
  interestedUsers: (UserDocument | string)[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageDocument extends Document {
  id: string;
  content: string;
  sender: UserDocument | string;
  receiver: UserDocument | string;
  item?: ItemDocument | string;
  status: 'SENT' | 'DELIVERED' | 'READ';
  createdAt: Date;
  updatedAt: Date;
}

export interface Context {
  user?: UserDocument;
  req: any;
}

export interface ItemFilters {
  category?: string;
  location?: string;
  search?: string;
  status?: 'AVAILABLE' | 'PENDING' | 'GIVEN' | 'DELETED';
}

export interface MessageInput {
  content: string;
  receiverId: string;
  itemId?: string;
}

export interface CreateItemInput {
  title: string;
  description: string;
  category: string;
  images: string[];
  location?: string;
}

export interface UpdateItemInput {
  title?: string;
  description?: string;
  category?: string;
  images?: string[];
  status?: 'AVAILABLE' | 'PENDING' | 'GIVEN' | 'DELETED';
  location?: string;
} 