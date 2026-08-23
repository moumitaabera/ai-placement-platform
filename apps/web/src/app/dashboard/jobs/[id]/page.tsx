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
    <div className="max-w-5xl mx-auto p-8">
      <JobDetails id={id} />
    </div>
  );
}