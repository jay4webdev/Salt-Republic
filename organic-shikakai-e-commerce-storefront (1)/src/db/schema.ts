import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  varchar,
} from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  name: text("name").notNull(),
  tamilName: text("tamil_name").notNull().default(""),
  tagline: text("tagline").notNull().default(""),
  description: text("description").notNull().default(""),
  longDescription: text("long_description").notNull().default(""),
  category: varchar("category", { length: 60 }).notNull().default("powders"),
  price: integer("price").notNull(),
  mrp: integer("mrp").notNull(),
  rating: integer("rating").notNull().default(45), // rating * 10 e.g. 48 = 4.8
  reviewCount: integer("review_count").notNull().default(0),
  images: jsonb("images").$type<string[]>().notNull().default([]),
  benefits: jsonb("benefits").$type<string[]>().notNull().default([]),
  ingredients: jsonb("ingredients").$type<string[]>().notNull().default([]),
  howToUse: jsonb("how_to_use").$type<string[]>().notNull().default([]),
  variants: jsonb("variants")
    .$type<{ label: string; price: number; mrp: number }[]>()
    .notNull()
    .default([]),
  badge: varchar("badge", { length: 40 }).notNull().default(""),
  isFeatured: boolean("is_featured").notNull().default(false),
  isBestseller: boolean("is_bestseller").notNull().default(false),
  stock: integer("stock").notNull().default(100),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  authorName: text("author_name").notNull(),
  location: text("location").notNull().default(""),
  rating: integer("rating").notNull(),
  title: text("title").notNull().default(""),
  body: text("body").notNull(),
  verified: boolean("verified").notNull().default(true),
  helpful: integer("helpful").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: varchar("order_number", { length: 20 }).notNull().unique(),
  customerName: text("customer_name").notNull(),
  email: text("email").notNull().default(""),
  phone: varchar("phone", { length: 20 }).notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull().default("Tamil Nadu"),
  pincode: varchar("pincode", { length: 10 }).notNull(),
  subtotal: integer("subtotal").notNull(),
  shipping: integer("shipping").notNull().default(0),
  total: integer("total").notNull(),
  paymentMethod: varchar("payment_method", { length: 30 }).notNull(),
  paymentStatus: varchar("payment_status", { length: 20 }).notNull().default("pending"),
  status: varchar("status", { length: 20 }).notNull().default("confirmed"),
  notes: text("notes").notNull().default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  productId: integer("product_id").notNull().default(0),
  productSlug: varchar("product_slug", { length: 120 }).notNull().default(""),
  productName: text("product_name").notNull(),
  variant: text("variant").notNull().default(""),
  image: text("image").notNull().default(""),
  qty: integer("qty").notNull(),
  price: integer("price").notNull(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Review = typeof reviews.$inferSelect;
export type Order = typeof orders.$inferSelect;
