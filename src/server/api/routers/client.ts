import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const taylorClientRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.client.findMany({ orderBy: { name: "asc" } });
  }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        phone: z.string(),
        address: z.string(),
        city: z.string(),
        state: z.string(),
        postal: z.string(),
        country: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.client.create({
        data: {
          name: input.name,
          email: input.email,
          phone: input.phone,
          address: input.address,
          city: input.city,
          state: input.state,
          postal: input.postal,
          country: input.country,
        },
      });
    }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    const client = await ctx.db.client.findFirst({
      orderBy: { createdAt: "desc" },
    });

    return client ?? null;
  }),
});
