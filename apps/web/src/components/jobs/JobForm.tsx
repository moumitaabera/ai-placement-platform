"use client";

import { useState } from "react";
import { createJob } from "@/services/job.service";

interface JobFormProps {
  initialData?: {
    title?: string;
    description?: string;
    location?: string;
    salary?: string;
    employmentType?: string;
    experienceLevel?: string;
    skills?: string[];
    deadline?: string;
  };
}

export default function JobForm({
  initialData,
}: JobFormProps) {

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    location: initialData?.location || "",
    salary: initialData?.salary || "",
    employmentType: initialData?.employmentType || "",
    experienceLevel: initialData?.experienceLevel || "",
    skills: initialData?.skills?.join(", ") || "",
    deadline: initialData?.deadline || "",
  });


  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };


  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      setLoading(true);


      await createJob({
        ...formData,
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim()),
      });


      alert(
        "Job created successfully!"
      );


    } catch (error) {

      console.error(error);

      alert(
        "Failed to create job"
      );


    } finally {

      setLoading(false);

    }

  };


  return (

    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow p-6 space-y-4"
    >

      <h2 className="text-2xl font-bold">
        Create Job
      </h2>


      <input
        name="title"
        placeholder="Job Title"
        value={formData.title}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      />


      <textarea
        name="description"
        placeholder="Job Description"
        value={formData.description}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      />


      <input
        name="location"
        placeholder="Location"
        value={formData.location}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      />


      <input
        name="salary"
        placeholder="Salary"
        value={formData.salary}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      />


      <input
        name="employmentType"
        placeholder="Employment Type (Full Time/Internship)"
        value={formData.employmentType}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      />


      <input
        name="experienceLevel"
        placeholder="Experience Level"
        value={formData.experienceLevel}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      />


      <input
        name="skills"
        placeholder="Skills (React, Node, SQL)"
        value={formData.skills}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      />


      <input
        type="date"
        name="deadline"
        value={formData.deadline}
        onChange={handleChange}
        className="border p-2 rounded w-full"
      />


      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-5 py-2 rounded"
      >

        {
          loading
          ? "Creating..."
          : "Create Job"
        }

      </button>


    </form>

  );
}