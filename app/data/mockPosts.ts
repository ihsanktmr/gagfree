import { Post, PostType } from "app/redux/post/types";

export const MOCK_POSTS: Post[] = [
  {
    _id: "mock1",
    title: "Vintage Sofa Giveaway",
    description:
      "A slightly used but very comfortable sofa in excellent condition. Free to anyone who can pick it up from Kadıköy. Perfect for a cozy living room.",
    userId: "user123",
    images: [
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPmfwJJj7diuCwM5iDfT5iz7dZlfMlRIpdUQ&s",
      },
    ],
    contact: {
      phoneNumber: "+905551234567",
      fullAddress: "Caferağa Mah., Kadıköy, Istanbul",
      latitude: 40.9901,
      longitude: 29.0282,
    },
    category: "Furniture",
    createdAt: new Date().toISOString(),
    postType: PostType.Giveaway,
  },
  {
    _id: "mock2",
    title: "Collection of Books",
    description:
      "A box of assorted books available for free. Various genres including fiction, non-fiction, and academic books. Located in Beşiktaş area.",
    userId: "user124",
    images: [
      {
        imageUrl:
          "https://c8.alamy.com/comp/PRT4DX/a-box-of-free-books-left-outside-a-second-hand-book-shop-in-central-london-PRT4DX.jpg",
      },
    ],
    contact: {
      phoneNumber: "+905551234568",
      fullAddress: "Bebek Mah., Beşiktaş, Istanbul",
      latitude: 41.0847,
      longitude: 29.0438,
    },
    category: "Books",
    createdAt: new Date().toISOString(),
    postType: PostType.Giveaway,
  },
  {
    _id: "mock3",
    title: "Kitchen Appliances Set",
    description:
      "Complete set of unused kitchen appliances including toaster, blender, and microwave. All in excellent condition. Must pick up from Maslak.",
    userId: "user125",
    images: [
      {
        imageUrl:
          "https://content.jdmagicbox.com/v2/comp/bangalore/s6/080pxx80.xx80.180721165014.a2s6/catalogue/yes-kitchen-equipments-bangalore-js16wir4j3.jpg",
      },
    ],
    contact: {
      phoneNumber: "+905551234569",
      fullAddress: "Maslak Mah., Sarıyer, Istanbul",
      latitude: 41.1121,
      longitude: 29.0209,
    },
    category: "Appliances",
    createdAt: new Date().toISOString(),
    postType: PostType.Giveaway,
  },
  {
    _id: "mock4",
    title: "Study Desk with Chair",
    description:
      "IKEA study desk with comfortable chair. Perfect for students or home office. Minor wear but sturdy. Located in Ataşehir.",
    userId: "user126",
    images: [
      {
        imageUrl: "https://picsum.photos/400/300",
      },
    ],
    contact: {
      phoneNumber: "+905551234570",
      fullAddress: "Ataşehir, Istanbul",
      latitude: 40.9923,
      longitude: 29.1244,
    },
    category: "Furniture",
    createdAt: new Date().toISOString(),
    postType: PostType.Giveaway,
  },
  {
    _id: "mock5",
    title: "Indoor Plants Collection",
    description:
      "Beautiful collection of indoor plants. Includes succulents and small trees. Must take all. Available in Moda area.",
    userId: "user127",
    images: [
      {
        imageUrl: "https://picsum.photos/400/300",
      },
    ],
    contact: {
      phoneNumber: "+905551234571",
      fullAddress: "Moda, Kadıköy, Istanbul",
      latitude: 40.9785,
      longitude: 29.0264,
    },
    category: "Garden",
    createdAt: new Date().toISOString(),
    postType: PostType.Giveaway,
  },
  {
    _id: "mock6",
    title: "Kitchen Appliances Set",
    description:
      "Bosch coffee maker and toaster. Both working perfectly. Available in Levent area.",
    userId: "user128",
    images: [
      {
        imageUrl: "https://picsum.photos/400/300",
      },
    ],
    contact: {
      phoneNumber: "+905551234572",
      fullAddress: "Levent, Beşiktaş, Istanbul",
      latitude: 41.0824,
      longitude: 29.0178,
    },
    category: "Appliances",
    createdAt: new Date().toISOString(),
    postType: PostType.Giveaway,
  },
  {
    _id: "mock7",
    title: "Art Supplies Collection",
    description:
      "Professional art supplies including oil paints and easel. Perfect for art students. Located in Moda.",
    userId: "user129",
    images: [
      {
        imageUrl: "https://picsum.photos/400/300",
      },
    ],
    contact: {
      phoneNumber: "+905551234573",
      fullAddress: "Moda, Kadıköy, Istanbul",
      latitude: 40.9785,
      longitude: 29.0264,
    },
    category: "Art",
    createdAt: new Date().toISOString(),
    postType: PostType.Giveaway,
  },
  {
    _id: "mock8",
    title: "Home Gym Equipment",
    description:
      "Complete home gym set including dumbbells and yoga mat. Must pick up from Üsküdar.",
    userId: "user130",
    images: [
      {
        imageUrl: "https://picsum.photos/400/300",
      },
    ],
    contact: {
      phoneNumber: "+905551234574",
      fullAddress: "Üsküdar Merkez, Istanbul",
      latitude: 41.0235,
      longitude: 29.0152,
    },
    category: "Sports",
    createdAt: new Date().toISOString(),
    postType: PostType.Giveaway,
  },
];
