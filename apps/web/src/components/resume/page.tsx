import ResumeManager from "@/components/resume/ResumeManager";

export default function ResumePage() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">
        Resume
      </h1>

      <ResumeManager />
    </div>
  );
}