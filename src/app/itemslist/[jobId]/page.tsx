import ItemsList from "~/app/_components/ItemsList";

export default function ItemsListPage({
  params,
}: {
  params: { jobId: string };
}) {
  const { jobId } = params;
  return <ItemsList jobId={+jobId} />;
}
