import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IConversation extends Document {
  participants: Types.ObjectId[];
  lastMessage?: Types.ObjectId;
  unreadCount: Map<string, number>;
  archivedBy: Types.ObjectId[];
  updatedAt: Date;
  createdAt: Date;
}

const conversationSchema = new Schema<IConversation>(
  {
    participants: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }],
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: 'Message'
    },
    unreadCount: {
      type: Map,
      of: Number,
      default: new Map()
    },
    archivedBy: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: []
    }]
  },
  {
    timestamps: true
  }
);

// Indexes
conversationSchema.index({ participants: 1 });
conversationSchema.index({ updatedAt: -1 });

// Ensure virtuals are included in JSON
conversationSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export const Conversation = mongoose.model<IConversation>('Conversation', conversationSchema);

// Export types for use in other files
export type ConversationType = mongoose.Document & IConversation; 