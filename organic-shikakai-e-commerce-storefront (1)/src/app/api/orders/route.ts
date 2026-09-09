import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

function genOrderNumber() {
  const d = new Date();
  const date = `${String(d.getDate()).padStart(2, "0")}${String(d.getMonth() + 1).padStart(2, "0")}`;
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `SM${date}${rand}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      paymentMethod,
      notes,
      items,
    } = body;

    if (!customerName || !phone || !address || !city || !pincode || !items?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!/^[6-9]\d{9}$/.test(String(phone).replace(/\s/g, ""))) {
      return NextResponse.json({ error: "Please enter a valid 10-digit mobile number" }, { status: 400 });
    }
    if (!/^\d{6}$/.test(String(pincode).replace(/\s/g, ""))) {
      return NextResponse.json({ error: "Please enter a valid 6-digit pincode" }, { status: 400 });
    }

    const cleanItems = items.map((it: Record<string, unknown>) => ({
      slug: String(it.slug || ""),
      name: String(it.name || "Product").slice(0, 200),
      variant: String(it.variant || "").slice(0, 80),
      image: String(it.image || "").slice(0, 500),
      qty: Math.min(Math.max(Number(it.qty) || 1, 1), 20),
      price: Math.max(Number(it.price) || 0, 0),
      productId: Number(it.productId) || 0,
    }));

    const subtotal = cleanItems.reduce((s: number, it: { qty: number; price: number }) => s + it.qty * it.price, 0);
    const shipping = 50; // flat shipping across India
    const total = subtotal + shipping;
    const orderNumber = genOrderNumber();

    const inserted = await db
      .insert(orders)
      .values({
        orderNumber,
        customerName: String(customerName).slice(0, 100),
        email: String(email || "").slice(0, 160),
        phone: String(phone).slice(0, 20),
        address: String(address).slice(0, 500),
        city: String(city).slice(0, 80),
        state: String(state || "Tamil Nadu").slice(0, 80),
        pincode: String(pincode).slice(0, 10),
        subtotal,
        shipping,
        total,
        paymentMethod: String(paymentMethod || "cod").slice(0, 30),
        paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
        status: "confirmed",
        notes: String(notes || "").slice(0, 500),
      })
      .returning();

    const order = inserted[0];

    await db.insert(orderItems).values(
      cleanItems.map((it: { productId: number; slug: string; name: string; variant: string; image: string; qty: number; price: number }) => ({
        orderId: order.id,
        productId: it.productId,
        productSlug: it.slug,
        productName: it.name,
        variant: it.variant,
        image: it.image,
        qty: it.qty,
        price: it.price,
      }))
    );

    return NextResponse.json({ orderNumber, total, shipping, subtotal }, { status: 201 });
  } catch (e) {
    console.error("Order creation failed", e);
    return NextResponse.json({ error: "Could not place order. Please try again." }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderNumber = searchParams.get("orderNumber");
  if (!orderNumber) return NextResponse.json({ error: "Missing orderNumber" }, { status: 400 });
  try {
    const rows = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber));
    if (!rows.length) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    const order = rows[0];
    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
    return NextResponse.json({ order, items });
  } catch (e) {
    console.error("Order fetch failed", e);
    return NextResponse.json({ error: "Could not fetch order" }, { status: 500 });
  }
}
