import { db, pool } from "./index";
import { products, reviews } from "./schema";
import { PRODUCT, REVIEWS } from "../data/catalog";

async function main() {
  console.log("Resetting + seeding Sai Madhu single-product catalog...");

  // Clean slate so the DB always matches the current single-product site
  await db.execute(`DELETE FROM reviews`);
  await db.execute(`DELETE FROM order_items`);
  await db.execute(`DELETE FROM orders`);
  await db.execute(`DELETE FROM products`);

  const inserted = await db
    .insert(products)
    .values({
      slug: PRODUCT.slug,
      name: PRODUCT.name,
      tamilName: PRODUCT.tamilName,
      tagline: PRODUCT.tagline,
      description: PRODUCT.description,
      longDescription: PRODUCT.longDescription,
      category: PRODUCT.category,
      price: PRODUCT.price,
      mrp: PRODUCT.mrp,
      rating: PRODUCT.rating,
      reviewCount: PRODUCT.reviewCount,
      images: PRODUCT.images,
      benefits: PRODUCT.benefits,
      ingredients: PRODUCT.ingredients,
      howToUse: PRODUCT.howToUse,
      variants: PRODUCT.variants,
      badge: PRODUCT.badge,
      isFeatured: true,
      isBestseller: true,
      stock: PRODUCT.stock,
    })
    .returning({ id: products.id });

  const productId = inserted[0].id;
  console.log(`  + ${PRODUCT.name} (id ${productId}) — ₹${PRODUCT.price} / ${PRODUCT.variants[0].label}`);

  for (const r of REVIEWS) {
    await db.insert(reviews).values({
      productId,
      authorName: r.authorName,
      location: r.location,
      rating: r.rating,
      title: r.title,
      body: r.body,
      verified: r.verified,
      helpful: 0,
      createdAt: new Date(Date.now() - r.daysAgo * 86400000),
    });
  }
  console.log(`  + ${REVIEWS.length} reviews inserted`);

  console.log("Seed complete!");
  await pool.end();
}

main().catch(async (e) => {
  console.error(e);
  await pool.end();
  process.exit(1);
});
