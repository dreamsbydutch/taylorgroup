import ItemsList from "~/app/_components/ItemsList";

export default async function ItemsListPage(props: {
  params: Promise<{ jobId: string }>;
}) {
  const params = await props.params;
  return <ItemsList jobId={Number(params.jobId)} />;
}
