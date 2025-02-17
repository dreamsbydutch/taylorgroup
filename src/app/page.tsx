import { api } from "~/trpc/server";
import CreateJobForm from "./_components/CreateJobForm";
import JobTable from "./_components/JobTable";

export default async function Home() {
  const jobs = await api.job.getAll();
  return (
    <div>
      <CreateJobForm />
      <JobTable {...{ jobs }} />
    </div>
  );
}
