
"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import {
  updateProfile,
  getProfile,
  StudentProfile,
} from "@/services/student.service";

interface ProfileFormData {
  college: string;
  department: string;
  course: string;
  year: number | "";
  cgpa: number | "";
  phone: string;
  linkedin: string;
  github: string;
  bio: string;
  skills: string;
}

export default function ProfileForm() {
  const [formData, setFormData] =
    useState<ProfileFormData>({
      college: "",
      department: "",
      course: "",
      year: "",
      cgpa: "",
      phone: "",
      linkedin: "",
      github: "",
      bio: "",
      skills: "",
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
        const response = await getProfile();

        const profile = response.data;

        if (profile) {
          setProfileExists(true);

          setFormData({
            college: profile.college ?? "",
            department: profile.department ?? "",
            course: profile.course ?? "",
            year: profile.year ?? "",
            cgpa: profile.cgpa ?? "",
            phone: profile.phone ?? "",
            linkedin: profile.linkedin ?? "",
            github: profile.github ?? "",
            bio: profile.bio ?? "",
            skills: (profile.skills ?? []).join(", "),
          });
        }
      } catch {
        setProfileExists(false);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "number"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const payload: StudentProfile = {
      college: formData.college,
      department: formData.department,
      course: formData.course,
      year: Number(formData.year),
      cgpa: Number(formData.cgpa),
      phone: formData.phone,
      linkedin: formData.linkedin,
      github: formData.github,
      bio: formData.bio,
      skills: formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    };

    try {
      setSaving(true);

      await updateProfile(payload);

      setProfileExists(true);
      setEditing(false);

      alert(
        profileExists
          ? "Profile updated successfully!"
          : "Profile created successfully!"
      );
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);

        alert(
          error.response?.data?.message ??
            "Failed to save profile"
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
          Loading profile...
        </p>
      </div>
    );
  }

  /*
   * =========================
   * Profile Overview
   * =========================
   */

  if (profileExists && !editing) {
    return (
      <div className="border rounded-2xl bg-white p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              Student Profile
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

        <div className="grid gap-4">
          <div>
            <p className="text-sm text-gray-500">
              College
            </p>
            <p className="font-medium">
              {formData.college || "Not provided"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Department
            </p>
            <p className="font-medium">
              {formData.department || "Not provided"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Course
            </p>
            <p className="font-medium">
              {formData.course || "Not provided"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">
                Year
              </p>
              <p className="font-medium">
                {formData.year || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                CGPA
              </p>
              <p className="font-medium">
                {formData.cgpa || "Not provided"}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Phone
            </p>
            <p className="font-medium">
              {formData.phone || "Not provided"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              LinkedIn
            </p>
            <p className="font-medium break-all">
              {formData.linkedin || "Not provided"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              GitHub
            </p>
            <p className="font-medium break-all">
              {formData.github || "Not provided"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Skills
            </p>
            <p className="font-medium">
              {formData.skills || "Not provided"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Bio
            </p>
            <p className="font-medium whitespace-pre-wrap">
              {formData.bio || "Not provided"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  /*
   * =========================
   * Create / Edit Form
   * =========================
   */

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 border rounded-2xl bg-white p-6 shadow-sm"
    >
      <h2 className="text-xl font-bold">
        {profileExists
          ? "Edit Student Profile"
          : "Create Student Profile"}
      </h2>

      <input
        name="college"
        placeholder="College"
        value={formData.college}
        onChange={handleChange}
        className="border p-2 rounded w-full"
        required
      />

      <input
        name="department"
        placeholder="Department"
        value={formData.department}
        onChange={handleChange}
        className="border p-2 rounded w-full"
        required
      />

      <input
        name="course"
        placeholder="Course"
        value={formData.course}
        onChange={handleChange}
        className="border p-2 rounded w-full"
        required
      />

      <input
        type="number"
        name="year"
        placeholder="Year"
        value={formData.year}
        onChange={handleChange}
        className="border p-2 rounded w-full"
        required
      />

      <input
        type="number"
        step="0.01"
        name="cgpa"
        placeholder="CGPA"
        value={formData.cgpa}
        onChange={handleChange}
        className="border p-2 rounded w-full"
        required
      />

      <input
        name="phone"
        placeholder="Phone"
        value={formData.phone}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      />

      <input
        name="linkedin"
        placeholder="LinkedIn"
        value={formData.linkedin}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      />

      <input
        name="github"
        placeholder="GitHub"
        value={formData.github}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      />

      <textarea
        name="bio"
        placeholder="Bio"
        value={formData.bio}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      />

      <textarea
        name="skills"
        placeholder="Skills (comma separated)"
        value={formData.skills}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      />

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
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
            className="border px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
