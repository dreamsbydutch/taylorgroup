"use client";

import {
  useForm,
  SubmitHandler,
  FieldErrors,
  UseFormRegister,
  Controller,
} from "react-hook-form";
import { useEffect, useState } from "react";
import { cn } from "~/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import CreateEmployee from "./CreateEmployee";
import { Button } from "~/components/ui/button";
import CreateLocation from "./CreateLocation";
import { api } from "~/trpc/react";
import { Location, User } from "@prisma/client";
import { createJob } from "~/server/api/actions/job";
// import { createJob } from "~/server/api/actions/job";
// import { getLocations, getEmployees } from "~/server/api/actions/location";

interface JobFormInputs {
  jobNumber: number;
  clientName: string;
  showName: string;
  venueId: number;
  advancedWarehouseId?: number;
  boothNumber: string;
  shipDate?: Date;
  projectManager: string;
  leadInstaller?: string;
  logisticsCoordinator?: string;
}

export default function CreateJobForm() {
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<JobFormInputs>();

  const employees: User[] | undefined = api.user.getAll.useQuery().data;
  const locations: Location[] | undefined = api.location.getAll.useQuery().data;

  const onSubmit: SubmitHandler<JobFormInputs> = async (data) => {
    data.jobNumber = +data.jobNumber;
    data.venueId = +data.venueId;
    data.shipDate = data.shipDate ? new Date(data.shipDate) : undefined;
    await createJob(data);
    console.log("Job created:", data);
  };

  const standardFormFields = [
    {
      id: "jobNumber",
      label: "Job Number",
      type: "number",
      required: true,
      className: ["w-28", "", ""],
    },
    {
      id: "clientName",
      label: "Client Name",
      type: "text",
      required: true,
      className: ["w-72", "", ""],
    },
    {
      id: "showName",
      label: "Show Name",
      type: "text",
      required: true,
      className: ["w-72", "", ""],
    },
    {
      id: "boothNumber",
      label: "Booth Number",
      type: "text",
      required: true,
      className: ["w-36", "", ""],
    },
    {
      id: "shipDate",
      label: "Ship Date",
      type: "datetime-local",
      required: false,
      className: ["w-42", "", ""],
    },
  ];
  const dropdownFormFields = [
    {
      type: "employee",
      id: "projectManager",
      label: "Project Manager",
      options: employees?.filter(
        (employee) => employee.position === "PROJECT_MANAGER",
      ),
      required: true,
      className: ["w-56", "", ""],
      handleCreateNew: () => setIsEmployeeModalOpen(true),
    },
    {
      type: "venue",
      id: "venueId",
      label: "Venue",
      options: locations?.filter((location) => location.type === "VENUE"),
      required: true,
      className: ["w-56", "", ""],
      handleCreateNew: () => setIsLocationModalOpen(true),
    },
    {
      type: "venue",
      id: "advancedWarehouseId",
      label: "Advanced Warehouse",
      options: locations?.filter((location) => location.type === "WAREHOUSE"),
      required: false,
      className: ["w-56", "", ""],
      handleCreateNew: () => setIsLocationModalOpen(true),
    },
    {
      type: "employee",
      id: "logisticsCoordinator",
      label: "Logistics Coordinator",
      options: employees?.filter(
        (employee) => employee.position === "LOGISTICS_COORDINATOR",
      ),
      required: false,
      className: ["w-56", "", ""],
      handleCreateNew: () => setIsEmployeeModalOpen(true),
    },
    {
      type: "employee",
      id: "leadInstaller",
      label: "Lead Installer",
      options: employees?.filter(
        (employee) => employee.position === "LEAD_INSTALLER",
      ),
      required: false,
      className: ["w-56", "", ""],
      handleCreateNew: () => setIsEmployeeModalOpen(true),
    },
  ];

  return (
    <div className="mx-4 my-8 flex flex-col items-center rounded-lg border border-gray-900 bg-gray-100 p-4 shadow-lg">
      <h2 className="mb-4 text-2xl font-bold">Create Job</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3">
          {standardFormFields.map((field) => (
            <StandardFormField
              key={field.id}
              {...{
                id: field.id,
                label: field.label,
                type: field.type,
                required: field.required,
                register,
                errors,
                className: field.className,
              }}
            />
          ))}
          {dropdownFormFields.map((field) => (
            <DropdownField
              key={field.id}
              {...{
                type: field.type as "employee" | "venue",
                label: field.label,
                options: field.options,
                required: field.required,
                control,
                name: field.id,
                handleCreateNew: field.handleCreateNew,
                className: field.className,
              }}
            />
          ))}
          <button
            type="submit"
            className="w-[200px] rounded bg-blue-500 p-2 text-white"
          >
            Create Job
          </button>
        </div>
      </form>
      {isEmployeeModalOpen && (
        <CreateEmployee onClose={() => setIsEmployeeModalOpen(false)} />
      )}
      {isLocationModalOpen && (
        <CreateLocation onClose={() => setIsLocationModalOpen(false)} />
      )}
    </div>
  );
}

function StandardFormField({
  id,
  label,
  type,
  required,
  register,
  errors,
  className,
}: {
  id: string;
  label: string;
  type: string;
  required: boolean;
  register: UseFormRegister<JobFormInputs>;
  errors: FieldErrors<JobFormInputs>;
  className?: string[];
}) {
  return (
    <div className={cn("", className?.[0])}>
      <label
        className={cn(className?.[1], "mb-0.5 block text-sm font-medium")}
        htmlFor={id}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={id}
        {...register(id as keyof JobFormInputs, {
          required: required,
        })}
        className={cn(
          "w-full rounded border border-gray-300 p-2",
          className?.[2],
        )}
      />
      {errors[id as keyof JobFormInputs] && (
        <p className="text-red-500">{label} is required</p>
      )}
    </div>
  );
}

function DropdownField({
  type,
  label,
  options,
  required = false,
  handleCreateNew,
  control,
  name,
  className,
}: {
  type: "venue" | "employee";
  label: string;
  options: Location[] | User[] | undefined;
  required?: boolean;
  handleCreateNew: (type: string) => void;
  control: any;
  name: string;
  className?: string[];
}) {
  const [selectOpen, setSelectOpen] = useState(false);
  return (
    <div className={cn("flex w-full max-w-4xl bg-white", className?.[0])}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            open={selectOpen}
            onOpenChange={setSelectOpen}
            onValueChange={(value) => field.onChange(value)}
          >
            <SelectTrigger
              className={cn("data-[placeholder]:text-gray-400", className?.[1])}
            >
              <SelectValue
                placeholder={`Choose ${label.startsWith("Advanced") ? "an" : "a"} ${label}`}
              />
            </SelectTrigger>
            <SelectContent>
              <Button
                variant="secondary"
                className={cn(
                  "w-full text-center font-semibold",
                  className?.[2],
                )}
                onClick={() => {
                  setSelectOpen(false);
                  handleCreateNew(label);
                }}
              >
                + Create New
              </Button>
              {type === "venue"
                ? (options as Location[])?.map((obj: Location) => (
                    <SelectItem key={obj.id} value={obj.id.toString()}>
                      {obj.name} - {obj.city}, {obj.state}
                    </SelectItem>
                  ))
                : (options as User[])?.map((obj: User) => (
                    <SelectItem key={obj.id} value={obj.id.toString()}>
                      {obj.firstName} {obj.lastName}
                    </SelectItem>
                  ))}
            </SelectContent>
          </Select>
        )}
      />
      {required && <span className="bg-gray-100 pl-2 text-red-500">*</span>}
    </div>
  );
}
