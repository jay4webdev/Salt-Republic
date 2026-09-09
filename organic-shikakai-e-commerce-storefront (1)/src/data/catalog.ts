export const SHIPPING_FEE = 50;
export const PRODUCT_PRICE = 300;
export const PRODUCT_SIZE = "200 g";

export type ProductInfo = {
  slug: string;
  name: string;
  tamilName: string;
  tagline: string;
  description: string;
  longDescription: string;
  category: string;
  price: number;
  mrp: number;
  rating: number; // x10 e.g. 48 = 4.8
  reviewCount: number;
  images: string[];
  benefits: string[];
  ingredients: string[];
  howToUse: string[];
  variants: { label: string; price: number; mrp: number }[];
  badge: string;
  stock: number;
};

export type ReviewInfo = {
  id: number;
  authorName: string;
  location: string;
  rating: number;
  title: string;
  body: string;
  verified: boolean;
  createdAt: string;
};

const GALLERY = {
  spices:
    "https://images.pexels.com/photos/31280796/pexels-photo-31280796.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  herbs:
    "https://images.pexels.com/photos/7615621/pexels-photo-7615621.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
};

export const PRODUCT: ProductInfo = {
  slug: "pure-shikakai-powder",
  name: "Sai Madhu Organic Shikakai Powder",
  tamilName: "சுத்தமான சீயக்காய் தூள்",
  tagline: "One powder. Stone-ground the paati way — nothing added, nothing taken away.",
  description:
    "Our signature single-ingredient shikakai powder — sun-dried and stone-ground in small weekly batches. One gentle, low-pH wash that leaves hair soft, shiny and full of body. No SLS, no soap, no silicones. Just the way your paati intended.",
  longDescription:
    "Sai Madhu's Pure Shikakai Powder begins in the foothills of Tamil Nadu, where mature shikakai pods (Acacia concinna) are hand-picked at peak ripeness, de-seeded, sun-dried for five days and slow stone-ground every single week. No soaps, no SLS, no fragrance, no preservatives — just one ingredient your grandmother would recognise.\n\nThe natural saponins create a soft, low lather that cleanses without stripping your scalp's precious oils, making it perfect for weekly oil-bath rituals, sensitive scalps and first-time natural washers. Loved across Tamil Nadu for visibly softer, detangled hair — and for how quickly it rinses clean even from waist-length hair.",
  category: "powders",
  price: 300,
  mrp: 300,
  rating: 48,
  reviewCount: 1703,
  images: [
    "/images/products/shikakai-classic.jpg",
    GALLERY.spices,
    GALLERY.herbs,
    "/images/hero-model.jpg",
  ],
  benefits: [
    "Gently cleanses without SLS, soap or silicones",
    "Reduces hair fall caused by harsh chemical shampoos",
    "Naturally conditions — soft, detangled, bouncy hair",
    "Soothes itchy, flaky scalps with cooling botanicals",
    "Safe for coloured, keratin-treated & children's hair",
    "One 200 g jar lasts 8–10 Sunday oil-bath washes",
  ],
  ingredients: [
    "100% Shikakai pods (Acacia concinna)",
    "Sun-dried for 5 days",
    "Stone-ground fresh every Monday",
    "No additives, no preservatives",
  ],
  howToUse: [
    "Mix 2–3 tbsp with warm water into a runny paste (add 1 tsp coconut milk for extra softness).",
    "Apply to a pre-oiled scalp in sections, massaging gently for 2 minutes.",
    "Leave 3–5 minutes like a mini mask, then rinse thoroughly with lukewarm water.",
    "Finish with a cool water rinse for mirror shine. No conditioner needed.",
  ],
  variants: [{ label: "200 g Jar", price: 300, mrp: 300 }],
  badge: "100% Pure",
  stock: 220,
};

export const REVIEWS: (Omit<ReviewInfo, "id" | "createdAt"> & { daysAgo: number })[] = [
  {
    authorName: "Priya Dharshini",
    location: "Coimbatore",
    rating: 5,
    title: "Exactly like my paati's podi!",
    body: "I was so scared to leave shampoo but this washes oil out beautifully and my hair feels so soft, not dry at all. Smells earthy and pure. Ordered a second jar for my amma immediately.",
    verified: true,
    daysAgo: 4,
  },
  {
    authorName: "Kavya M.",
    location: "Chennai",
    rating: 5,
    title: "Hair fall reduced in 3 washes",
    body: "Using with coconut oil pre-wash. Earlier I used to lose a handful daily, now barely a few strands. Romba nandri Sai Madhu akka!",
    verified: true,
    daysAgo: 9,
  },
  {
    authorName: "Vasuki A.",
    location: "Kumbakonam",
    rating: 5,
    title: "Soft like the old days",
    body: "The smell took me straight back to my grandmother's thinnai. Washes out in one go and my waist-length hair feels softer than with any fancy shampoo.",
    verified: true,
    daysAgo: 12,
  },
  {
    authorName: "Janani R.",
    location: "Madurai",
    rating: 4,
    title: "Great — needed one practice wash",
    body: "First time the paste was too thick. Second time I made it runny like the instructions say and it was perfect. Hair is bouncy and full. Only wish the jar had a scoop.",
    verified: true,
    daysAgo: 18,
  },
  {
    authorName: "Sowmya V.",
    location: "Salem",
    rating: 5,
    title: "Curls look so defined now",
    body: "I have 3B curls and this gives slip like a conditioner but washes clean. My daughter's school-hair tangles are gone too. We're never going back.",
    verified: true,
    daysAgo: 25,
  },
  {
    authorName: "Meenakshi S.",
    location: "Trichy",
    rating: 5,
    title: "Sensitive scalp saviour",
    body: "I have a psoriasis-prone scalp and every shampoo made it itch. This is the only wash that calms it — no flakes after one month. Grinded so fine, no grit at all.",
    verified: true,
    daysAgo: 33,
  },
];

export const formatINR = (n: number) => "₹" + n.toLocaleString("en-IN");
