import ItemsList from "~/app/_components/ItemsList";

export default async function ItemsListPage({
  params,
}: {
  params: { jobId: string };
}) {
  const { jobId } = await params;
  return <ItemsList jobId={+jobId} />;
}
