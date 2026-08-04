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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();

        const profile = response.data;

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
      } catch {
        console.log("No profile yet");
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
      await updateProfile(payload);

      alert("Profile updated successfully!");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);

        alert(
          error.response?.data?.message ??
            "Failed to update profile"
        );
      } else {
        alert("Something went wrong");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <input
        name="college"
        placeholder="College"
        value={formData.college}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      />

      <input
        name="department"
        placeholder="Department"
        value={formData.department}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      />

      <input
        name="course"
        placeholder="Course"
        value={formData.course}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      />

      <input
        type="number"
        name="year"
        placeholder="Year"
        value={formData.year}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      />

      <input
        type="number"
        step="0.01"
        name="cgpa"
        placeholder="CGPA"
        value={formData.cgpa}
        onChange={handleChange}
        className="border p-2 rounded w-full"
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

      <button
        type="submit"
        className="bg-black text-white px-4 py-2 rounded"
      >
        Save Profile
      </button>
    </form>
  );
}