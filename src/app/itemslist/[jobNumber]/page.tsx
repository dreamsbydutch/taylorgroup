import ItemsList from "~/app/_components/ItemsList";

export default async function ItemsListPage(props: {
  params: Promise<{ jobNumber: string }>;
}) {
  const params = await props.params;
  return <ItemsList jobNumber={Number(params.jobNumber)} />;
}
