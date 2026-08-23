"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getMe } from "@/services/auth.service";
import ProfileForm from "@/components/forms/ProfileForm";
import RecruiterProfileForm from "@/components/forms/RecruiterProfileForm";

type UserRole = "STUDENT" | "RECRUITER";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await getMe();

        setUser(response.data);
      } catch (error) {
        console.error("Profile loading error:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">
          Loading profile...
        </p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (user.role === "RECRUITER") {
    return (
      <div className="max-w-3xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">
          Recruiter Profile
        </h1>

        <RecruiterProfileForm />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">
        Student Profile
      </h1>

      <ProfileForm />
    </div>
  );
}