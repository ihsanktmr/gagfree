import mongoose, { Document, Schema } from "mongoose";

export interface IMessage extends Document {
  content: string;
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  conversation: mongoose.Types.ObjectId;
  item?: mongoose.Types.ObjectId;
  status: "SENT" | "DELIVERED" | "READ";
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    conversation: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    item: {
      type: Schema.Types.ObjectId,
      ref: "Item",
    },
    status: {
      type: String,
      enum: ["SENT", "DELIVERED", "READ"],
      default: "SENT",
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// Compound indexes for faster queries
messageSchema.index({ conversation: 1, createdAt: -1 });
messageSchema.index({ sender: 1, receiver: 1 });
messageSchema.index({ sender: 1, status: 1 });
messageSchema.index({ receiver: 1, status: 1 });

// Virtual for formatted dates
messageSchema.virtual("formattedCreatedAt").get(function () {
  return this.createdAt.toISOString();
});

messageSchema.virtual("formattedUpdatedAt").get(function () {
  return this.updatedAt.toISOString();
});

// Ensure virtuals are included in JSON
messageSchema.set("toJSON", {
  virtuals: true,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

// Pre-save middleware
messageSchema.pre("save", function (next) {
  if (this.isNew) {
    // Any pre-save operations for new messages
  }
  next();
});

// Static methods
messageSchema.statics.getUnreadCount = async function (userId: string) {
  return this.countDocuments({
    receiver: userId,
    status: { $ne: "READ" },
  });
};

messageSchema.statics.markAsRead = async function (
  conversationId: string,
  userId: string,
) {
  return this.updateMany(
    {
      conversation: conversationId,
      receiver: userId,
      status: { $ne: "READ" },
    },
    {
      $set: { status: "READ" },
    },
  );
};

export const Message = mongoose.model<IMessage>("Message", messageSchema);

// Types for resolvers
export interface SendMessageInput {
  content: string;
  receiverId: string;
  itemId?: string;
}

export interface MessageFilters {
  status?: "SENT" | "DELIVERED" | "READ";
  fromDate?: Date;
  toDate?: Date;
}
