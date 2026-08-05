import { ReactNode } from "react";

export default function RecruiterLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Recruiter Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Manage jobs and applications
          </p>
        </div>

        {children}
      </div>
    </div>
  );
}