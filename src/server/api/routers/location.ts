import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

// Enum to match the LocationType in the Prisma schema
const LocationTypeEnum = z.enum(["WAREHOUSE", "VENUE"]);

export const locationRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.location.findMany();
  }),

  create: publicProcedure
    .input(
      z.object({
        type: LocationTypeEnum,
        name: z.string().min(1),
        address: z.string().min(1),
        city: z.string().min(1),
        state: z.string().min(1),
        zip: z.string().min(1),
        country: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.location.create({
        data: {
          type: input.type,
          name: input.name,
          address: input.address,
          city: input.city,
          state: input.state,
          zip: input.zip,
          country: input.country,
        },
      });
    }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    const job = await ctx.db.location.findFirst({
      orderBy: { createdAt: "desc" },
    });

    return job ?? null;
  }),
});
