import EditJobForm from "@/components/jobs/EditJobForm";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditJobPage({
  params,
}: PageProps) {

  const { id } = await params;

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Edit Job
      </h1>

      <EditJobForm id={id} />

    </div>
  );
}