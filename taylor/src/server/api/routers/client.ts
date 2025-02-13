import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const clientRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.client.findMany({ orderBy: { name: "asc" } });
  }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.client.create({
        data: {
          name: input.name,
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
