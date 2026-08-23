"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import {
  getRecruiterProfile,
  updateRecruiterProfile,
  RecruiterProfile,
} from "@/services/recruiter.service";

interface FormData {
  designation: string;
  companyId: string;
}

export default function RecruiterProfileForm() {
  const [formData, setFormData] = useState<FormData>({
    designation: "",
    companyId: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getRecruiterProfile();

        const profile: RecruiterProfile = response.data;

        setFormData({
          designation: profile.designation ?? "",
          companyId: profile.companyId ?? "",
        });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(
            "Recruiter profile:",
            error.response?.data
          );
        } else {
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setSaving(true);

      await updateRecruiterProfile({
        designation: formData.designation,
        companyId: formData.companyId || null,
      });

      alert("Recruiter profile updated successfully!");
    } catch (error: unknown) {
      console.error(error);

      if (axios.isAxiosError(error)) {
        alert(
          error.response?.data?.message ??
            "Failed to update recruiter profile"
        );
      } else {
        alert("Something went wrong");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="border rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-gray-500">
          Loading recruiter profile...
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 border rounded-2xl bg-white p-6 shadow-sm"
    >
      <div>
        <label
          htmlFor="designation"
          className="block text-sm font-medium mb-2"
        >
          Designation
        </label>

        <input
          id="designation"
          name="designation"
          type="text"
          placeholder="e.g. HR Manager"
          value={formData.designation}
          onChange={handleChange}
          className="border p-3 rounded-lg w-full"
          required
        />
      </div>

      <div>
        <label
          htmlFor="companyId"
          className="block text-sm font-medium mb-2"
        >
          Company ID
        </label>

        <input
          id="companyId"
          name="companyId"
          type="text"
          placeholder="Optional"
          value={formData.companyId}
          onChange={handleChange}
          className="border p-3 rounded-lg w-full"
        />

        <p className="text-xs text-gray-500 mt-2">
          Leave this empty if you dont have a company ID yet.
        </p>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="bg-black text-white px-5 py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Profile"}
      </button>
    </form>
  );
}