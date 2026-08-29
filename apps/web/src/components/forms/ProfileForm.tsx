
// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";

// import {
//   updateProfile,
//   getProfile,
//   StudentProfile,
// } from "@/services/student.service";

// interface ProfileFormData {
//   college: string;
//   department: string;
//   course: string;
//   year: number | "";
//   cgpa: number | "";
//   phone: string;
//   linkedin: string;
//   github: string;
//   bio: string;
//   skills: string;
// }

// export default function ProfileForm() {
//   const [formData, setFormData] =
//     useState<ProfileFormData>({
//       college: "",
//       department: "",
//       course: "",
//       year: "",
//       cgpa: "",
//       phone: "",
//       linkedin: "",
//       github: "",
//       bio: "",
//       skills: "",
//     });

//   const [profileExists, setProfileExists] =
//     useState(false);

//   const [editing, setEditing] =
//     useState(false);

//   const [loading, setLoading] =
//     useState(true);

//   const [saving, setSaving] =
//     useState(false);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const response = await getProfile();

//         const profile = response.data;

//         if (profile) {
//           setProfileExists(true);

//           setFormData({
//             college: profile.college ?? "",
//             department: profile.department ?? "",
//             course: profile.course ?? "",
//             year: profile.year ?? "",
//             cgpa: profile.cgpa ?? "",
//             phone: profile.phone ?? "",
//             linkedin: profile.linkedin ?? "",
//             github: profile.github ?? "",
//             bio: profile.bio ?? "",
//             skills: (profile.skills ?? []).join(", "),
//           });
//         }
//       } catch {
//         setProfileExists(false);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, []);

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement
//     >
//   ) => {
//     const { name, value, type } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]:
//         type === "number"
//           ? value === ""
//             ? ""
//             : Number(value)
//           : value,
//     }));
//   };

//   const handleSubmit = async (
//     e: React.FormEvent
//   ) => {
//     e.preventDefault();

//     const payload: StudentProfile = {
//       college: formData.college,
//       department: formData.department,
//       course: formData.course,
//       year: Number(formData.year),
//       cgpa: Number(formData.cgpa),
//       phone: formData.phone,
//       linkedin: formData.linkedin,
//       github: formData.github,
//       bio: formData.bio,
//       skills: formData.skills
//         .split(",")
//         .map((skill) => skill.trim())
//         .filter(Boolean),
//     };

//     try {
//       setSaving(true);

//       await updateProfile(payload);

//       setProfileExists(true);
//       setEditing(false);

//       alert(
//         profileExists
//           ? "Profile updated successfully!"
//           : "Profile created successfully!"
//       );
//     } catch (error: unknown) {
//       if (axios.isAxiosError(error)) {
//         console.log(error.response?.data);

//         alert(
//           error.response?.data?.message ??
//             "Failed to save profile"
//         );
//       } else {
//         alert("Something went wrong");
//       }
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="border rounded-2xl bg-white p-6 shadow-sm">
//         <p className="text-gray-500">
//           Loading profile...
//         </p>
//       </div>
//     );
//   }

//   /*
//    * =========================
//    * Profile Overview
//    * =========================
//    */

//   if (profileExists && !editing) {
//     return (
//       <div className="border rounded-2xl bg-white p-6 shadow-sm space-y-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-2xl font-bold">
//               Student Profile
//             </h2>

//             <p className="text-sm text-green-600 mt-1">
//               ✓ Profile created successfully
//             </p>
//           </div>

//           <button
//             type="button"
//             onClick={() => setEditing(true)}
//             className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800"
//           >
//             Edit Profile
//           </button>
//         </div>

//         <div className="grid gap-4">
//           <div>
//             <p className="text-sm text-gray-500">
//               College
//             </p>
//             <p className="font-medium">
//               {formData.college || "Not provided"}
//             </p>
//           </div>

//           <div>
//             <p className="text-sm text-gray-500">
//               Department
//             </p>
//             <p className="font-medium">
//               {formData.department || "Not provided"}
//             </p>
//           </div>

//           <div>
//             <p className="text-sm text-gray-500">
//               Course
//             </p>
//             <p className="font-medium">
//               {formData.course || "Not provided"}
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <p className="text-sm text-gray-500">
//                 Year
//               </p>
//               <p className="font-medium">
//                 {formData.year || "Not provided"}
//               </p>
//             </div>

//             <div>
//               <p className="text-sm text-gray-500">
//                 CGPA
//               </p>
//               <p className="font-medium">
//                 {formData.cgpa || "Not provided"}
//               </p>
//             </div>
//           </div>

//           <div>
//             <p className="text-sm text-gray-500">
//               Phone
//             </p>
//             <p className="font-medium">
//               {formData.phone || "Not provided"}
//             </p>
//           </div>

//           <div>
//             <p className="text-sm text-gray-500">
//               LinkedIn
//             </p>
//             <p className="font-medium break-all">
//               {formData.linkedin || "Not provided"}
//             </p>
//           </div>

//           <div>
//             <p className="text-sm text-gray-500">
//               GitHub
//             </p>
//             <p className="font-medium break-all">
//               {formData.github || "Not provided"}
//             </p>
//           </div>

//           <div>
//             <p className="text-sm text-gray-500">
//               Skills
//             </p>
//             <p className="font-medium">
//               {formData.skills || "Not provided"}
//             </p>
//           </div>

//           <div>
//             <p className="text-sm text-gray-500">
//               Bio
//             </p>
//             <p className="font-medium whitespace-pre-wrap">
//               {formData.bio || "Not provided"}
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   /*
//    * =========================
//    * Create / Edit Form
//    * =========================
//    */

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="space-y-4 border rounded-2xl bg-white p-6 shadow-sm"
//     >
//       <h2 className="text-xl font-bold">
//         {profileExists
//           ? "Edit Student Profile"
//           : "Create Student Profile"}
//       </h2>

//       <input
//         name="college"
//         placeholder="College"
//         value={formData.college}
//         onChange={handleChange}
//         className="border p-2 rounded w-full"
//         required
//       />

//       <input
//         name="department"
//         placeholder="Department"
//         value={formData.department}
//         onChange={handleChange}
//         className="border p-2 rounded w-full"
//         required
//       />

//       <input
//         name="course"
//         placeholder="Course"
//         value={formData.course}
//         onChange={handleChange}
//         className="border p-2 rounded w-full"
//         required
//       />

//       <input
//         type="number"
//         name="year"
//         placeholder="Year"
//         value={formData.year}
//         onChange={handleChange}
//         className="border p-2 rounded w-full"
//         required
//       />

//       <input
//         type="number"
//         step="0.01"
//         name="cgpa"
//         placeholder="CGPA"
//         value={formData.cgpa}
//         onChange={handleChange}
//         className="border p-2 rounded w-full"
//         required
//       />

//       <input
//         name="phone"
//         placeholder="Phone"
//         value={formData.phone}
//         onChange={handleChange}
//         className="border p-2 rounded w-full"
//       />

//       <input
//         name="linkedin"
//         placeholder="LinkedIn"
//         value={formData.linkedin}
//         onChange={handleChange}
//         className="border p-2 rounded w-full"
//       />

//       <input
//         name="github"
//         placeholder="GitHub"
//         value={formData.github}
//         onChange={handleChange}
//         className="border p-2 rounded w-full"
//       />

//       <textarea
//         name="bio"
//         placeholder="Bio"
//         value={formData.bio}
//         onChange={handleChange}
//         className="border p-2 rounded w-full"
//       />

//       <textarea
//         name="skills"
//         placeholder="Skills (comma separated)"
//         value={formData.skills}
//         onChange={handleChange}
//         className="border p-2 rounded w-full"
//       />

//       <div className="flex gap-3">
//         <button
//           type="submit"
//           disabled={saving}
//           className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
//         >
//           {saving
//             ? "Saving..."
//             : profileExists
//               ? "Update Profile"
//               : "Create Profile"}
//         </button>

//         {profileExists && (
//           <button
//             type="button"
//             onClick={() => setEditing(false)}
//             className="border px-4 py-2 rounded"
//           >
//             Cancel
//           </button>
//         )}
//       </div>
//     </form>
//   );
// }


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
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex min-h-55 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />

            <p className="text-sm font-semibold text-slate-700">
              Loading profile...
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Please wait while we load your profile information.
            </p>
          </div>
        </div>
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
      <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Header */}
        <div className="border-b border-slate-200 bg-slate-50/70 px-6 py-6 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-lg font-bold text-blue-700">
                SP
              </div>

              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                  Student Profile
                </h2>

                <div className="mt-1 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />

                  <p className="text-sm font-medium text-emerald-600">
                    Profile created successfully
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setEditing(true)}
              className="inline-flex h-10 items-center justify-center rounded-lg bg-slate-900! px-5 text-sm font-semibold text-white! shadow-sm transition hover:!bg-slate-800! focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Profile Information */}
        <div className="p-6 sm:p-8">
          <div className="mb-6">
            <h3 className="text-base font-semibold text-slate-900">
              Personal & Academic Information
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Your profile information visible on the platform.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* College */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                College
              </p>

              <p className="mt-2 wrap-break-word text-sm font-semibold text-slate-900">
                {formData.college || "Not provided"}
              </p>
            </div>

            {/* Department */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Department
              </p>

              <p className="mt-2 wrap-break-word text-sm font-semibold text-slate-900">
                {formData.department || "Not provided"}
              </p>
            </div>

            {/* Course */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Course
              </p>

              <p className="mt-2 wrap-break-word text-sm font-semibold text-slate-900">
                {formData.course || "Not provided"}
              </p>
            </div>

            {/* Year */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Academic Year
              </p>

              <p className="mt-2 text-sm font-semibold text-slate-900">
                {formData.year || "Not provided"}
              </p>
            </div>

            {/* CGPA */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                CGPA
              </p>

              <p className="mt-2 text-sm font-semibold text-slate-900">
                {formData.cgpa || "Not provided"}
              </p>
            </div>

            {/* Phone */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Phone
              </p>

              <p className="mt-2 wrap-break-word text-sm font-semibold text-slate-900">
                {formData.phone || "Not provided"}
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div className="mt-8">
            <h3 className="text-base font-semibold text-slate-900">
              Professional Links
            </h3>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  LinkedIn
                </p>

                <p className="mt-2 break-all text-sm font-medium text-blue-600">
                  {formData.linkedin || "Not provided"}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  GitHub
                </p>

                <p className="mt-2 break-all text-sm font-medium text-blue-600">
                  {formData.github || "Not provided"}
                </p>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="mt-8">
            <h3 className="text-base font-semibold text-slate-900">
              Skills
            </h3>

            <div className="mt-4">
              {formData.skills ? (
                <div className="flex flex-wrap gap-2">
                  {formData.skills
                    .split(",")
                    .map((skill) => skill.trim())
                    .filter(Boolean)
                    .map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700"
                      >
                        {skill}
                      </span>
                    ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  Not provided
                </p>
              )}
            </div>
          </div>

          {/* Bio */}
          <div className="mt-8">
            <h3 className="text-base font-semibold text-slate-900">
              About
            </h3>

            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/50 p-5">
              <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                {formData.bio || "Not provided"}
              </p>
            </div>
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
      className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      {/* Header */}
      <div className="border-b border-slate-200 bg-slate-50/70 px-6 py-6 sm:px-8">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          {profileExists
            ? "Edit Student Profile"
            : "Create Student Profile"}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {profileExists
            ? "Keep your academic and professional information up to date."
            : "Add your academic and professional information to complete your profile."}
        </p>
      </div>

      <div className="space-y-8 p-6 sm:p-8">
        {/* Academic Information */}
        <section>
          <div className="mb-5">
            <h3 className="text-base font-semibold text-slate-900">
              Academic Information
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Enter your current educational details.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* College */}
            <div>
              <label
                htmlFor="college"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                College
              </label>

              <input
                id="college"
                name="college"
                placeholder="Enter your college name"
                value={formData.college}
                onChange={handleChange}
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>

            {/* Department */}
            <div>
              <label
                htmlFor="department"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Department
              </label>

              <input
                id="department"
                name="department"
                placeholder="e.g. Computer Science & Engineering"
                value={formData.department}
                onChange={handleChange}
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>

            {/* Course */}
            <div>
              <label
                htmlFor="course"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Course
              </label>

              <input
                id="course"
                name="course"
                placeholder="e.g. B.Tech"
                value={formData.course}
                onChange={handleChange}
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>

            {/* Year */}
            <div>
              <label
                htmlFor="year"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Academic Year
              </label>

              <input
                id="year"
                type="number"
                name="year"
                placeholder="e.g. 4"
                value={formData.year}
                onChange={handleChange}
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>

            {/* CGPA */}
            <div className="md:col-span-2">
              <label
                htmlFor="cgpa"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                CGPA
              </label>

              <input
                id="cgpa"
                type="number"
                step="0.01"
                name="cgpa"
                placeholder="e.g. 8.25"
                value={formData.cgpa}
                onChange={handleChange}
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="border-t border-slate-200 pt-8">
          <div className="mb-5">
            <h3 className="text-base font-semibold text-slate-900">
              Contact & Professional Information
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Add your contact details and professional profiles.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Phone
              </label>

              <input
                id="phone"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* LinkedIn */}
            <div>
              <label
                htmlFor="linkedin"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                LinkedIn
              </label>

              <input
                id="linkedin"
                name="linkedin"
                placeholder="https://linkedin.com/in/yourname"
                value={formData.linkedin}
                onChange={handleChange}
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* GitHub */}
            <div className="md:col-span-2">
              <label
                htmlFor="github"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                GitHub
              </label>

              <input
                id="github"
                name="github"
                placeholder="https://github.com/yourusername"
                value={formData.github}
                onChange={handleChange}
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </section>

        {/* Skills & Bio */}
        <section className="border-t border-slate-200 pt-8">
          <div className="mb-5">
            <h3 className="text-base font-semibold text-slate-900">
              Skills & About
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Tell recruiters about your skills and yourself.
            </p>
          </div>

          <div className="space-y-5">
            {/* Skills */}
            <div>
              <label
                htmlFor="skills"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Skills
              </label>

              <textarea
                id="skills"
                name="skills"
                rows={3}
                placeholder="React, Node.js, JavaScript, SQL"
                value={formData.skills}
                onChange={handleChange}
                className="w-full resize-y rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <p className="mt-2 text-xs text-slate-500">
                Separate multiple skills with commas.
              </p>
            </div>

            {/* Bio */}
            <div>
              <label
                htmlFor="bio"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Bio
              </label>

              <textarea
                id="bio"
                name="bio"
                rows={5}
                placeholder="Write a short introduction about yourself..."
                value={formData.bio}
                onChange={handleChange}
                className="w-full resize-y rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
          {profileExists && (
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-11 items-center justify-center rounded-lg bg-blue-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : profileExists
                ? "Update Profile"
                : "Create Profile"}
          </button>
        </div>
      </div>
    </form>
  );
}