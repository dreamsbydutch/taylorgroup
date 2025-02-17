import ItemsList from "~/app/_components/ItemsList";

export default async function ItemsListPage({
  params,
}: {
  params: { jobId: string };
}) {
  return <ItemsList jobId={Number(params.jobId)} />;
}
