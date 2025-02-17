"use client";

import { Job } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { cn } from "~/lib/utils";

export default function JobTable({ jobs }: { jobs: Job[] }) {
  const router = useRouter();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell>Job Number</TableCell>
          <TableCell>Client Name</TableCell>
          <TableCell>Show Name</TableCell>
          <TableCell>Ship Date</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {jobs
          .sort(
            (a, b) =>
              new Date(a.shipDate!).getTime() - new Date(b.shipDate!).getTime(),
          )
          .map((job) => (
            <TableRow key={job.id}>
              <TableCell>{job.jobNumber}</TableCell>
              <TableCell>{job.clientName}</TableCell>
              <TableCell>{job.showName}</TableCell>
              <TableCell
                className={cn(job.shipDate! < new Date(), "text-red-500")}
              >
                {new Date(job.shipDate!).toLocaleDateString("en-US", {
                  timeZone: "America/New_York",
                  dateStyle: "full",
                })}
              </TableCell>
              <TableCell>
                <Button onClick={() => router.push("/itemslist/" + job.id)}>
                  Items List
                </Button>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
