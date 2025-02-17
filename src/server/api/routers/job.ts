import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const jobRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.job.findMany({ orderBy: { jobNumber: "asc" } });
  }),
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.job.findFirst({
        where: { id: input.id },
      });
    }),

  create: publicProcedure
    .input(
      z.object({
        jobNumber: z.number().min(1),
        projectManager: z.string().min(1),
        shipDate: z.date().optional(),
        showName: z.string().min(1),
        clientName: z.string().min(1),
        boothNumber: z.string().min(1),
        venueId: z.number().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.job.create({
        data: {
          jobNumber: input.jobNumber,
          projectManager: input.projectManager,
          shipDate: input.shipDate,
          showName: input.showName,
          clientName: input.clientName,
          boothNumber: input.boothNumber,
          venueId: input.venueId,
        },
      });
    }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    const job = await ctx.db.job.findFirst({
      orderBy: { createdAt: "desc" },
    });

    return job ?? null;
  }),
});
