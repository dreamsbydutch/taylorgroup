"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { createLocation } from "~/server/api/actions/location";

interface LocationFormInputs {
  type: "VENUE" | "WAREHOUSE";
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: "USA" | "Canada";
}

const usaStates = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

const canadaProvinces = [
  "Alberta",
  "British Columbia",
  "Manitoba",
  "New Brunswick",
  "Newfoundland and Labrador",
  "Nova Scotia",
  "Ontario",
  "Prince Edward Island",
  "Quebec",
  "Saskatchewan",
];

export default function CreateLocation({ onClose }: { onClose: () => void }) {
  const [country, setCountry] = useState<"USA" | "Canada">("USA");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LocationFormInputs>();

  const onSubmit: SubmitHandler<LocationFormInputs> = async (data) => {
    await createLocation(data);
    console.log("Location created:", data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-96 rounded bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-2xl font-bold">Create Location</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium" htmlFor="type">
              Type
            </label>
            <select
              id="type"
              {...register("type", { required: true })}
              className="w-full rounded border border-gray-300 p-2"
            >
              <option value="VENUE">Show Venue</option>
              <option value="WAREHOUSE">Advanced Warehouse</option>
            </select>
            {errors.type && <p className="text-red-500">Type is required</p>}
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              {...register("name", { required: true })}
              className="w-full rounded border border-gray-300 p-2"
            />
            {errors.name && <p className="text-red-500">Name is required</p>}
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium" htmlFor="address">
              Address
            </label>
            <input
              type="text"
              id="address"
              {...register("address", { required: true })}
              className="w-full rounded border border-gray-300 p-2"
            />
            {errors.address && (
              <p className="text-red-500">Address is required</p>
            )}
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium" htmlFor="city">
              City
            </label>
            <input
              type="text"
              id="city"
              {...register("city", { required: true })}
              className="w-full rounded border border-gray-300 p-2"
            />
            {errors.city && <p className="text-red-500">City is required</p>}
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium" htmlFor="country">
              Country
            </label>
            <select
              id="country"
              {...register("country", { required: true })}
              className="w-full rounded border border-gray-300 p-2"
              onChange={(e) => setCountry(e.target.value as "USA" | "Canada")}
            >
              <option value="USA">USA</option>
              <option value="Canada">Canada</option>
            </select>
            {errors.country && (
              <p className="text-red-500">Country is required</p>
            )}
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium" htmlFor="state">
              {country === "USA" ? "State" : "Province"}
            </label>
            <select
              id="state"
              {...register("state", { required: true })}
              className="w-full rounded border border-gray-300 p-2"
            >
              <option value="" disabled hidden>
                Choose a {country === "USA" ? "State" : "Province"}
              </option>
              {country === "USA"
                ? usaStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))
                : canadaProvinces.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
            </select>
            {errors.state && (
              <p className="text-red-500">
                {country === "USA" ? "State" : "Province"} is required
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium" htmlFor="zip">
              {country === "USA" ? "Zip" : "Postal"} Code
            </label>
            <input
              type="text"
              id="zip"
              {...register("zip", { required: true })}
              className="w-full rounded border border-gray-300 p-2"
            />
            {errors.zip && (
              <p className="text-red-500">
                {country === "USA" ? "Zip" : "Postal"} Code is required
              </p>
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
              Create Location
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
