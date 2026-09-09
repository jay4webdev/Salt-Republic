import { db } from "@/db";
import { products, reviews } from "@/db/schema";
import { eq } from "drizzle-orm";
import { PRODUCT, REVIEWS, type ProductInfo, type ReviewInfo } from "@/data/catalog";
import {
  AnnouncementBar,
  Header,
  HeroSection,
  Marquee,
  ValueProps,
  Showcase,
  RitualSection,
  ReviewsSection,
  FaqSection,
  InstagramSection,
  Footer,
} from "@/components/site";

export const dynamic = "force-dynamic";

function reviewFromRow(r: typeof reviews.$inferSelect): ReviewInfo {
  return {
    id: r.id,
    authorName: r.authorName,
    location: r.location,
    rating: r.rating,
    title: r.title,
    body: r.body,
    verified: r.verified,
    createdAt: r.createdAt.toISOString(),
  };
}

function reviewFromSeed(r: (typeof REVIEWS)[number], i: number): ReviewInfo {
  return {
    id: i + 1,
    authorName: r.authorName,
    location: r.location,
    rating: r.rating,
    title: r.title,
    body: r.body,
    verified: r.verified,
    createdAt: new Date(Date.now() - r.daysAgo * 86400000).toISOString(),
  };
}

export default async function HomePage() {
  let product: ProductInfo = PRODUCT;
  let reviewList: ReviewInfo[] = REVIEWS.map(reviewFromSeed);

  try {
    const rows = await db.select().from(products).where(eq(products.slug, PRODUCT.slug));
    if (rows.length > 0) {
      const r = rows[0];
      product = {
        slug: r.slug,
        name: r.name,
        tamilName: r.tamilName,
        tagline: r.tagline,
        description: r.description,
        longDescription: r.longDescription,
        category: r.category,
        price: r.price,
        mrp: r.mrp,
        rating: r.rating,
        reviewCount: r.reviewCount,
        images: r.images,
        benefits: r.benefits,
        ingredients: r.ingredients,
        howToUse: r.howToUse,
        variants: r.variants,
        badge: r.badge,
        stock: r.stock,
      };
      const dbReviews = await db.select().from(reviews).where(eq(reviews.productId, r.id));
      if (dbReviews.length > 0) {
        reviewList = dbReviews.map(reviewFromRow);
      }
    }
  } catch {
    // DB unavailable — use seeded fallbacks
  }

  return (
    <>
      <AnnouncementBar />
      <Header />
      <HeroSection product={product} />
      <Marquee />
      <ValueProps />
      <Showcase product={product} />
      <RitualSection />
      <ReviewsSection product={product} reviews={reviewList} />
      <FaqSection />
      <InstagramSection />
      <Footer />
    </>
  );
}
