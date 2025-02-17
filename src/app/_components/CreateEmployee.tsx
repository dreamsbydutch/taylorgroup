"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { createUser } from "~/server/api/actions/user";

interface EmployeeFormInputs {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  position:
    | "ADMIN"
    | "ACCOUNT_MANAGER"
    | "PROJECT_MANAGER"
    | "LOGISTICS_COORDINATOR"
    | "LEAD_INSTALLER"
    | "INSTALLER"
    | "WOOD_SHOP_LEAD"
    | "METAL_SHOP_LEAD"
    | "GRAPHICS_MANAGER"
    | "SHIPPING_MANAGER";
}

export default function CreateEmployee({ onClose }: { onClose: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeFormInputs>();

  const onSubmit: SubmitHandler<EmployeeFormInputs> = async (data) => {
    await createUser(data);
    console.log("Employee created:", data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-96 rounded bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-2xl font-bold">Create Employee</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register("email", { required: true })}
              className="w-full rounded border border-gray-300 p-2"
            />
            {errors.email && <p className="text-red-500">Email is required</p>}
          </div>
          <div className="mb-4">
            <label
              className="mb-1 block text-sm font-medium"
              htmlFor="firstName"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              {...register("firstName", { required: true })}
              className="w-full rounded border border-gray-300 p-2"
            />
            {errors.firstName && (
              <p className="text-red-500">First name is required</p>
            )}
          </div>
          <div className="mb-4">
            <label
              className="mb-1 block text-sm font-medium"
              htmlFor="lastName"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              {...register("lastName", { required: true })}
              className="w-full rounded border border-gray-300 p-2"
            />
            {errors.lastName && (
              <p className="text-red-500">Last name is required</p>
            )}
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium" htmlFor="phone">
              Phone
            </label>
            <input
              type="text"
              id="phone"
              {...register("phone", { required: true })}
              className="w-full rounded border border-gray-300 p-2"
            />
            {errors.phone && <p className="text-red-500">Phone is required</p>}
          </div>
          <div className="mb-4">
            <label
              className="mb-1 block text-sm font-medium"
              htmlFor="position"
            >
              Position
            </label>
            <select
              id="position"
              {...register("position", { required: true })}
              className="w-full rounded border border-gray-300 p-2"
            >
              <option value="" disabled hidden>
                Choose a Position
              </option>
              <option value="ADMIN">ADMIN</option>
              <option value="ACCOUNT_MANAGER">ACCOUNT_MANAGER</option>
              <option value="PROJECT_MANAGER">PROJECT_MANAGER</option>
              <option value="LOGISTICS_COORDINATOR">
                LOGISTICS_COORDINATOR
              </option>
              <option value="LEAD_INSTALLER">LEAD_INSTALLER</option>
              <option value="INSTALLER">INSTALLER</option>
              <option value="WOOD_SHOP_LEAD">WOOD_SHOP_LEAD</option>
              <option value="METAL_SHOP_LEAD">METAL_SHOP_LEAD</option>
              <option value="GRAPHICS_MANAGER">GRAPHICS_MANAGER</option>
              <option value="SHIPPING_MANAGER">SHIPPING_MANAGER</option>
            </select>
            {errors.position && (
              <p className="text-red-500">Position is required</p>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 rounded bg-gray-500 p-2 text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-blue-500 p-2 text-white"
            >
              Create Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
