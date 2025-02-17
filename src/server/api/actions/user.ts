"use server";

import { z } from "zod";
import { api } from "~/trpc/server";

const userSchema = z.object({
  email: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().min(1),
  position: z.enum([
    "ADMIN",
    "ACCOUNT_MANAGER",
    "PROJECT_MANAGER",
    "LOGISTICS_COORDINATOR",
    "LEAD_INSTALLER",
    "INSTALLER",
    "WOOD_SHOP_LEAD",
    "METAL_SHOP_LEAD",
    "GRAPHICS_MANAGER",
    "SHIPPING_MANAGER",
  ]),
});

export async function createUser(data: z.infer<typeof userSchema>) {
  const validatedData = userSchema.parse(data);
  return api.user.create(validatedData);
}
