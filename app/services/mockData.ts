import { Post, PostType } from "app/redux/post/types";

export const MOCK_POSTS: Post[] = [
  {
    _id: "mock1",
    title: "Sofa",
    description:
      "A comfortable three-seater sofa in good condition. Perfect for a living room or family room. Some minor wear but still has plenty of life left. Must pick up from location.",
    userId: "user123",
    images: [
      {
        imageUrl:
          "https://firebasestorage.googleapis.com/v0/b/givefreelyapp.appspot.com/o/posts%2Fsofa.jpg?alt=media",
      },
    ],
    contact: {
      phoneNumber: "+1234567890",
      fullAddress: "123 First St, Manhattan, NY",
      latitude: 40.7831,
      longitude: -73.9712,
    },
    category: "Furniture",
    createdAt: new Date().toISOString(),
    postType: PostType.Giveaway,
  },
  {
    _id: "mock2",
    title: "Study Desk",
    description:
      "Sturdy wooden study desk with three drawers. Great for students or home office. In excellent condition with minimal scratches. Includes chair. Must collect.",
    userId: "user124",
    images: [
      {
        imageUrl:
          "https://firebasestorage.googleapis.com/v0/b/givefreelyapp.appspot.com/o/posts%2Fdesk.jpg?alt=media",
      },
    ],
    contact: {
      phoneNumber: "+1234567891",
      fullAddress: "456 Second Ave, Brooklyn, NY",
      latitude: 40.6782,
      longitude: -73.9442,
    },
    category: "Furniture",
    createdAt: new Date().toISOString(),
    postType: PostType.Giveaway,
  },
  {
    _id: "mock3",
    title: "University Textbooks",
    description:
      "Collection of university level textbooks. Includes Calculus, Physics, and Chemistry books. Some highlighting but otherwise in good condition. Great for STEM students.",
    userId: "user125",
    images: [
      {
        imageUrl:
          "https://firebasestorage.googleapis.com/v0/b/givefreelyapp.appspot.com/o/posts%2Fbooks.jpg?alt=media",
      },
    ],
    contact: {
      phoneNumber: "+1234567892",
      fullAddress: "789 Third St, Queens, NY",
      latitude: 40.7282,
      longitude: -73.7949,
    },
    category: "Books",
    createdAt: new Date().toISOString(),
    postType: PostType.Giveaway,
  },
  {
    _id: "1",
    title: "iPhone 12 Pro",
    description:
      "Used iPhone in good condition, giving away to someone in need",
    userId: "user1",
    images: [
      {
        imageUrl: "https://picsum.photos/400/300",
      },
    ],
    contact: {
      phoneNumber: "+1234567890",
      fullAddress: "123 Main St, New York, NY",
      latitude: 40.7128,
      longitude: -74.006,
    },
    category: "Electronics",
    createdAt: new Date().toISOString(),
    postType: PostType.Giveaway,
  },
  {
    _id: "2",
    title: "Dining Table",
    description: "Wooden dining table, seats 6, good condition",
    userId: "user2",
    images: [
      {
        imageUrl: "https://picsum.photos/400/300",
      },
    ],
    contact: {
      phoneNumber: "+1234567891",
      fullAddress: "456 Oak St, Brooklyn, NY",
      latitude: 40.6782,
      longitude: -73.9442,
    },
    category: "Furniture",
    createdAt: new Date().toISOString(),
    postType: PostType.Giveaway,
  },
  {
    _id: "3",
    title: "Children's Books Collection",
    description:
      "A collection of 20+ children's books in excellent condition. Perfect for ages 5-10.",
    userId: "user3",
    images: [
      {
        imageUrl: "https://picsum.photos/400/300",
      },
    ],
    contact: {
      phoneNumber: "+1234567892",
      fullAddress: "789 Pine St, Queens, NY",
      latitude: 40.7282,
      longitude: -73.7949,
    },
    category: "Books",
    createdAt: new Date().toISOString(),
    postType: PostType.Giveaway,
  },
  {
    _id: "4",
    title: "Garden Tools Set",
    description:
      "Complete set of garden tools including shovel, rake, and pruning shears.",
    userId: "user4",
    images: [
      {
        imageUrl: "https://picsum.photos/400/300",
      },
    ],
    contact: {
      phoneNumber: "+1234567893",
      fullAddress: "321 Maple Ave, Staten Island, NY",
      latitude: 40.5795,
      longitude: -74.1502,
    },
    category: "Garden",
    createdAt: new Date().toISOString(),
    postType: PostType.Giveaway,
  },
  {
    _id: "5",
    title: "Gaming Console",
    description:
      "PlayStation 4 with two controllers. Works perfectly, upgrading to newer model.",
    userId: "user5",
    images: [
      {
        imageUrl: "https://picsum.photos/400/300",
      },
    ],
    contact: {
      phoneNumber: "+1234567894",
      fullAddress: "654 Elm St, Bronx, NY",
      latitude: 40.8448,
      longitude: -73.8648,
    },
    category: "Electronics",
    createdAt: new Date().toISOString(),
    postType: PostType.Giveaway,
  },
  {
    _id: "6",
    title: "Kitchen Appliances",
    description:
      "Microwave and coffee maker, both in working condition. Moving and need to give away.",
    userId: "user6",
    images: [
      {
        imageUrl: "https://picsum.photos/400/300",
      },
    ],
    contact: {
      phoneNumber: "+1234567895",
      fullAddress: "987 Cedar Rd, Manhattan, NY",
      latitude: 40.7831,
      longitude: -73.9712,
    },
    category: "Appliances",
    createdAt: new Date().toISOString(),
    postType: PostType.Giveaway,
  },
  {
    _id: "7",
    title: "Art Supplies",
    description:
      "Various art supplies including paints, brushes, and canvases. Perfect for beginners.",
    userId: "user7",
    images: [
      {
        imageUrl: "https://picsum.photos/400/300",
      },
    ],
    contact: {
      phoneNumber: "+1234567896",
      fullAddress: "147 Art St, Brooklyn, NY",
      latitude: 40.6782,
      longitude: -73.9442,
    },
    category: "Art",
    createdAt: new Date().toISOString(),
    postType: PostType.Giveaway,
  },
  {
    _id: "8",
    title: "Fitness Equipment",
    description:
      "Yoga mat, resistance bands, and 2 sets of dumbbells. Great for home workouts.",
    userId: "user8",
    images: [
      {
        imageUrl: "https://picsum.photos/400/300",
      },
    ],
    contact: {
      phoneNumber: "+1234567897",
      fullAddress: "258 Health Ave, Queens, NY",
      latitude: 40.7282,
      longitude: -73.7949,
    },
    category: "Sports",
    createdAt: new Date().toISOString(),
    postType: PostType.Giveaway,
  },
];
