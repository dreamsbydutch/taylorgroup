import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const jobRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.job.findMany({ orderBy: { jobNumber: "asc" } });
  }),

  create: publicProcedure
    .input(
      z.object({
        jobNumber: z.number().min(1),
        projectManager: z.string().min(1),
        shipDate: z.string().min(1),
        showName: z.string().min(1),
        clientId: z.number().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.job.create({
        data: {
          jobNumber: input.jobNumber,
          projectManager: input.projectManager,
          shipDate: input.shipDate,
          showName: input.showName,
          clientId: input.clientId,
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
