import { z } from "zod";

export const FOOD_OPTIONS = ["Not Required", "Breakfast", "Lunch", "Dinner"] as const;
export const ACTIVITY_OPTIONS = [
  "Jet Ski",
  "Underwater Scooters",
  "Inflatable Paddle Boat",
] as const;

const whatsapp = z
  .string()
  .trim()
  .min(7, "Please enter a valid WhatsApp number.")
  .max(20)
  .regex(/^\+?[0-9\s-]{7,20}$/, "Please enter a valid WhatsApp number.");

export const bookingInputSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(120),
  whatsapp,
  guests: z.coerce
    .number({ error: "Please enter the number of guests." })
    .int({ error: "Please enter the number of guests." })
    .min(1, "Please enter the number of guests.")
    .max(17, "Day charters are limited to 17 guests."),
  tripTypeId: z.coerce.number().int().positive("Please choose a trip type."),
  destination: z.string().trim().min(1, "Please choose a destination."),
  tripDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Please choose a valid trip date."),
  pickupTime: z.string().regex(/^\d{2}:\d{2}$/, "Please choose a pickup time."),
  dropoffTime: z.string().regex(/^\d{2}:\d{2}$/, "Please choose a drop-off time."),
  pickupLocation: z.string().trim().min(2, "Please enter the pickup location.").max(160),
  dropoffLocation: z
    .string()
    .trim()
    .min(2, "Please enter the drop-off location.")
    .max(160),
  foodPrefs: z.array(z.string()).default([]),
  activityRequests: z.array(z.string()).default([]),
  specialRequests: z.string().trim().max(2000).optional().default(""),
});

export type BookingInput = z.infer<typeof bookingInputSchema>;

export function todayISO(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function humanizeZodError(
  error: z.ZodError,
  capacity?: number
): Record<string, string> {
  const map: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0]?.toString() ?? "form";
    if (!map[key]) {
      if (key === "guests" && capacity && issue.code === "too_big") {
        map[key] = `This trip is limited to ${capacity} guests.`;
      } else {
        map[key] = issue.message;
      }
    }
  }
  return map;
}

export const subscriberSchema = z.object({
  whatsapp: z
    .string()
    .trim()
    .min(7, "Please enter a valid WhatsApp number.")
    .max(20)
    .regex(/^\+?[0-9\s-]{7,20}$/, "Please enter a valid WhatsApp number."),
  source: z.string().trim().max(40).default("website"),
});
