import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

// Assuming the enum is defined in your Prisma schema as UserRole
const userRoles = [
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
] as const;

export const userRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findMany({});
  }),

  create: publicProcedure
    .input(
      z.object({
        email: z.string().min(1),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        phone: z.string().min(1),
        position: z.enum(userRoles),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.create({
        data: {
          email: input.email,
          firstName: input.firstName,
          lastName: input.lastName,
          phone: input.phone,
          position: input.position,
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
