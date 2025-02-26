"use client";

import { Job } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
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
  const [filter, setFilter] = useState({
    jobNumber: "",
    clientName: "",
    showName: "",
    directShipDate: "",
  });
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Job;
    direction: "asc" | "desc";
  } | null>(null);

  const filteredJobs = jobs.filter((job) => {
    return (
      (filter.jobNumber === "" ||
        job.jobNumber.toString().includes(filter.jobNumber)) &&
      (filter.clientName === "" ||
        job.clientName
          .toLowerCase()
          .includes(filter.clientName.toLowerCase())) &&
      (filter.showName === "" ||
        job.showName.toLowerCase().includes(filter.showName.toLowerCase())) &&
      (filter.directShipDate === "" ||
        new Date(job.directShipDate!)
          .toLocaleDateString("en-US", {
            timeZone: "America/New_York",
            dateStyle: "full",
          })
          .includes(filter.directShipDate))
    );
  });

  const sortedJobs = sortConfig
    ? [...filteredJobs].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      })
    : filteredJobs;

  const handleSort = (key: keyof Job, direction: "asc" | "desc") => {
    setSortConfig({ key, direction });
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger>Job Number</DropdownMenuTrigger>
                <DropdownMenuContent>
                  <Input
                    type="text"
                    placeholder="Filter Job Number"
                    value={filter.jobNumber}
                    onChange={(e) =>
                      setFilter({ ...filter, jobNumber: e.target.value })
                    }
                    className="w-full rounded border border-gray-300 p-2"
                  />
                  <DropdownMenuItem
                    onClick={() => handleSort("jobNumber", "asc")}
                  >
                    Sort Ascending
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleSort("jobNumber", "desc")}
                  >
                    Sort Descending
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger>Client Name</DropdownMenuTrigger>
                <DropdownMenuContent>
                  <Input
                    type="text"
                    placeholder="Filter Client Name"
                    value={filter.clientName}
                    onChange={(e) =>
                      setFilter({ ...filter, clientName: e.target.value })
                    }
                    className="w-full rounded border border-gray-300 p-2"
                  />
                  <DropdownMenuItem
                    onClick={() => handleSort("clientName", "asc")}
                  >
                    Sort Ascending
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleSort("clientName", "desc")}
                  >
                    Sort Descending
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger>Show Name</DropdownMenuTrigger>
                <DropdownMenuContent>
                  <Input
                    type="text"
                    placeholder="Filter Show Name"
                    value={filter.showName}
                    onChange={(e) =>
                      setFilter({ ...filter, showName: e.target.value })
                    }
                    className="w-full rounded border border-gray-300 p-2"
                  />
                  <DropdownMenuItem
                    onClick={() => handleSort("showName", "asc")}
                  >
                    Sort Ascending
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleSort("showName", "desc")}
                  >
                    Sort Descending
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger>Ship Date</DropdownMenuTrigger>
                <DropdownMenuContent>
                  <Input
                    type="text"
                    placeholder="Filter Ship Date"
                    value={filter.directShipDate}
                    onChange={(e) =>
                      setFilter({ ...filter, directShipDate: e.target.value })
                    }
                    className="w-full rounded border border-gray-300 p-2"
                  />
                  <DropdownMenuItem
                    onClick={() => handleSort("directShipDate", "asc")}
                  >
                    Sort Ascending
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleSort("directShipDate", "desc")}
                  >
                    Sort Descending
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedJobs.map((job) => (
            <TableRow key={job.id}>
              <TableCell>{job.jobNumber}</TableCell>
              <TableCell>{job.clientName}</TableCell>
              <TableCell>{job.showName}</TableCell>
              <TableCell
                className={cn(job.directShipDate! < new Date(), "text-red-500")}
              >
                {job.directShipDate?.toLocaleDateString() ?? "N/A"}
              </TableCell>
              <TableCell>
                <Button
                  onClick={() => router.push("/itemslist/" + job.jobNumber)}
                >
                  Items List
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
