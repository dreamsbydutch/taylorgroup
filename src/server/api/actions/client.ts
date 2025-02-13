"use server";

import { api } from "~/trpc/server";

export async function createTaylorClient({
  name,
  email,
  phone,
  address,
  city,
  postal,
  state,
  country,
}: {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal: string;
  state: string;
  country: string;
}) {
  return await api.taylorClient.create({
    name,
    email,
    phone,
    address,
    city,
    postal,
    state,
    country,
  });
}
