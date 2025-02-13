import { api } from "~/trpc/server";
import CreateClient from "./_components/CreateClient";
import ItemsList from "./_components/ItemsList";

export default async function Home() {
  const clients = await api.taylorClient.getAll();
  return (
    <div>
      {clients.map((a) => (
        <div className="flex" key={a.id}>
          {a.name}
        </div>
      ))}
      <CreateClient />
      <ItemsList />
    </div>
  );
}
