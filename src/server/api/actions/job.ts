"use server";

import { z } from "zod";
import { api } from "~/trpc/server";

const jobSchema = z.object({
  jobNumber: z.number().min(1),
  projectManager: z.string().min(1),
  shipDate: z.date().optional(),
  showName: z.string().min(1),
  clientName: z.string().min(1),
  boothNumber: z.string().min(1),
  venueId: z.number().min(1),
  advancedWarehouseId: z.number().optional(),
  leadInstaller: z.string().optional(),
  logisticsCoordinator: z.string().optional(),
});

export async function createJob(data: z.infer<typeof jobSchema>) {
  data.shipDate?.setHours(data.shipDate.getHours() + 5);
  const validatedData = jobSchema.parse(data);
  return api.job.create(validatedData);
}
