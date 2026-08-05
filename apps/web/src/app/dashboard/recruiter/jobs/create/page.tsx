import JobForm from "@/components/jobs/JobForm";

export default function CreateJobPage() {
  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Create New Job
      </h1>

      <JobForm />

    </div>
  );
}