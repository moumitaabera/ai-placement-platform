
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

  const [profileExists, setProfileExists] =
    useState(false);

  const [editing, setEditing] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getRecruiterProfile();

        const profile: RecruiterProfile =
          response.data;

        if (profile) {
          setProfileExists(true);

          setFormData({
            designation:
              profile.designation ?? "",
            companyId:
              profile.companyId ?? "",
          });
        }
      } catch (error) {
        setProfileExists(false);

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

      setProfileExists(true);
      setEditing(false);

      alert(
        profileExists
          ? "Recruiter profile updated successfully!"
          : "Recruiter profile created successfully!"
      );
    } catch (error: unknown) {
      console.error(error);

      if (axios.isAxiosError(error)) {
        alert(
          error.response?.data?.message ??
            "Failed to save recruiter profile"
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

  /*
   * =========================
   * Recruiter Profile Overview
   * =========================
   */

  if (profileExists && !editing) {
    return (
      <div className="border rounded-2xl bg-white p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">
              Recruiter Profile
            </h2>

            <p className="text-sm text-green-600 mt-1">
              ✓ Profile created successfully
            </p>
          </div>

          <button
            type="button"
            onClick={() => setEditing(true)}
            className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800"
          >
            Edit Profile
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-sm text-gray-500">
              Designation
            </p>

            <p className="font-medium text-lg">
              {formData.designation ||
                "Not provided"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Company ID
            </p>

            <p className="font-medium break-all">
              {formData.companyId ||
                "Not provided"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  /*
   * =========================
   * Create / Edit Recruiter Profile
   * =========================
   */

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 border rounded-2xl bg-white p-6 shadow-sm"
    >
      <div>
        <h2 className="text-xl font-bold">
          {profileExists
            ? "Edit Recruiter Profile"
            : "Create Recruiter Profile"}
        </h2>

        {!profileExists && (
          <p className="text-sm text-gray-500 mt-1">
            Complete your recruiter profile to
            manage recruitment activities.
          </p>
        )}
      </div>

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
          Leave this empty if you do not have a
          company ID yet.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-black text-white px-5 py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : profileExists
              ? "Update Profile"
              : "Create Profile"}
        </button>

        {profileExists && (
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="border px-5 py-3 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}