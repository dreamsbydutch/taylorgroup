"use server";

import { z } from "zod";
import { api } from "~/trpc/server";

const jobSchema = z.object({
  jobNumber: z.number().min(1),
  projectManagerId: z.number().min(1),
  showName: z.string().min(1),
  clientName: z.string().min(1),
  boothNumber: z.string().min(1),
  venueId: z.number().min(1),
  advancedWarehouseId: z.number().optional(),
  leadInstallerId: z.string().optional(),
  logisticsCoordinatorId: z.string().optional(),
});

export async function createJob(data: z.infer<typeof jobSchema>) {

  const validatedData = jobSchema.parse(data);
  return api.job.create(validatedData);
}



export async function updateJobDates(data: z.infer<typeof jobSchema>) {
  
  const venue = await api.location.getById({ id: data.venueId });

  const response = await fetch(
    `/api/distance?address1=${encodeURIComponent("16 Commerce Rd, Orangeville, ON L9W 2X7")}&address2=${encodeURIComponent(venue?.address ?? ""+", "+venue?.city ?? ""+", "+venue?.state ?? ""+", "+venue?.zip ?? "")}`,
  );
  const result = await response.json();


  return 
}