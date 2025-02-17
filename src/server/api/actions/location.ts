"use server";

import { z } from "zod";
import { api } from "~/trpc/server";

const locationSchema = z.object({
  type: z.enum(["WAREHOUSE", "VENUE"]),
  name: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  zip: z.string().min(1),
  country: z.string().min(1),
});

export async function createLocation(data: z.infer<typeof locationSchema>) {
  const validatedData = locationSchema.parse(data);
  return api.location.create(validatedData);
}
