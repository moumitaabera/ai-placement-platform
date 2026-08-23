import JobDetails from "@/components/jobs/JobDetails";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function JobDetailsPage({
  params,
}: PageProps) {

  const { id } = await params;

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Job Details
      </h1>

      <JobDetails id={id} />

    </div>
  );
}