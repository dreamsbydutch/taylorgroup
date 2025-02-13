"use client";

import { useState } from "react";
import { createTaylorClient } from "~/server/api/actions/client";
import { api } from "~/trpc/react";

const usStates = [
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

const canadianProvinces = [
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

export default function CreateTaylorClient() {
  const [clientData, setClientData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postal: "",
    state: "",
    country: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setClientData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const utils = api.useUtils();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await createTaylorClient(clientData);

    await utils.taylorClient.invalidate();
    setIsModalOpen(false);
  };

  return (
    <div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="rounded bg-blue-500 p-2 text-white"
      >
        Create Client
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-96 rounded bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-2xl font-bold">Create Client</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  className="mb-1 block text-sm font-medium"
                  htmlFor="name"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={clientData.name}
                  onChange={handleChange}
                  className="w-full rounded border border-gray-300 p-2"
                />
              </div>
              <div className="mb-4">
                <label
                  className="mb-1 block text-sm font-medium"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={clientData.email}
                  onChange={handleChange}
                  className="w-full rounded border border-gray-300 p-2"
                />
              </div>
              <div className="mb-4">
                <label
                  className="mb-1 block text-sm font-medium"
                  htmlFor="phone"
                >
                  Phone
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={clientData.phone}
                  onChange={handleChange}
                  className="w-full rounded border border-gray-300 p-2"
                />
              </div>
              <div className="mb-4">
                <label
                  className="mb-1 block text-sm font-medium"
                  htmlFor="address"
                >
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={clientData.address}
                  onChange={handleChange}
                  className="w-full rounded border border-gray-300 p-2"
                />
              </div>
              <div className="mb-4 flex space-x-4">
                <div className="flex-1">
                  <label
                    className="mb-1 block text-sm font-medium"
                    htmlFor="city"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={clientData.city}
                    onChange={handleChange}
                    className="w-full rounded border border-gray-300 p-2"
                  />
                </div>
                <div className="flex-1">
                  <label
                    className="mb-1 block text-sm font-medium"
                    htmlFor="postal"
                  >
                    {clientData.country === "Canada"
                      ? "Postal Code"
                      : "ZIP Code"}
                  </label>
                  <input
                    type="text"
                    id="postal"
                    name="postal"
                    value={clientData.postal}
                    onChange={handleChange}
                    className="w-full rounded border border-gray-300 p-2"
                  />
                </div>
              </div>
              <div className="mb-4 flex space-x-4">
                <div className="flex-1">
                  <label
                    className="mb-1 block text-sm font-medium"
                    htmlFor="state"
                  >
                    {clientData.country === "Canada" ? "Province" : "State"}
                  </label>
                  <select
                    id="state"
                    name="state"
                    value={clientData.state}
                    onChange={handleChange}
                    className="w-full rounded border border-gray-300 p-2"
                  >
                    <option value="">
                      {clientData.country === "Canada"
                        ? "Select Province"
                        : "Select State"}
                    </option>
                    {clientData.country === "Canada"
                      ? canadianProvinces.map((province) => (
                          <option key={province} value={province}>
                            {province}
                          </option>
                        ))
                      : usStates.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label
                    className="mb-1 block text-sm font-medium"
                    htmlFor="country"
                  >
                    Country
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={clientData.country}
                    onChange={handleChange}
                    className="w-full rounded border border-gray-300 p-2"
                  >
                    <option value="">Select Country</option>
                    <option value="USA">USA</option>
                    <option value="Canada">Canada</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="mr-2 rounded bg-gray-500 p-2 text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-blue-500 p-2 text-white"
                >
                  Create Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
