
// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";

// import {
//   getRecruiterProfile,
//   updateRecruiterProfile,
//   RecruiterProfile,
// } from "@/services/recruiter.service";

// interface FormData {
//   designation: string;
//   companyId: string;
// }

// export default function RecruiterProfileForm() {
//   const [formData, setFormData] = useState<FormData>({
//     designation: "",
//     companyId: "",
//   });

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
//         const response = await getRecruiterProfile();

//         const profile: RecruiterProfile =
//           response.data;

//         if (profile) {
//           setProfileExists(true);

//           setFormData({
//             designation:
//               profile.designation ?? "",
//             companyId:
//               profile.companyId ?? "",
//           });
//         }
//       } catch (error) {
//         setProfileExists(false);

//         if (axios.isAxiosError(error)) {
//           console.log(
//             "Recruiter profile:",
//             error.response?.data
//           );
//         } else {
//           console.error(error);
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, []);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const { name, value } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (
//     e: React.FormEvent
//   ) => {
//     e.preventDefault();

//     try {
//       setSaving(true);

//       await updateRecruiterProfile({
//         designation: formData.designation,
//         companyId: formData.companyId || null,
//       });

//       setProfileExists(true);
//       setEditing(false);

//       alert(
//         profileExists
//           ? "Recruiter profile updated successfully!"
//           : "Recruiter profile created successfully!"
//       );
//     } catch (error: unknown) {
//       console.error(error);

//       if (axios.isAxiosError(error)) {
//         alert(
//           error.response?.data?.message ??
//             "Failed to save recruiter profile"
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
//           Loading recruiter profile...
//         </p>
//       </div>
//     );
//   }

//   /*
//    * =========================
//    * Recruiter Profile Overview
//    * =========================
//    */

//   if (profileExists && !editing) {
//     return (
//       <div className="border rounded-2xl bg-white p-6 shadow-sm space-y-6">
//         <div className="flex items-center justify-between gap-4">
//           <div>
//             <h2 className="text-2xl font-bold">
//               Recruiter Profile
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

//         <div className="space-y-5">
//           <div>
//             <p className="text-sm text-gray-500">
//               Designation
//             </p>

//             <p className="font-medium text-lg">
//               {formData.designation ||
//                 "Not provided"}
//             </p>
//           </div>

//           <div>
//             <p className="text-sm text-gray-500">
//               Company ID
//             </p>

//             <p className="font-medium break-all">
//               {formData.companyId ||
//                 "Not provided"}
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   /*
//    * =========================
//    * Create / Edit Recruiter Profile
//    * =========================
//    */

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="space-y-6 border rounded-2xl bg-white p-6 shadow-sm"
//     >
//       <div>
//         <h2 className="text-xl font-bold">
//           {profileExists
//             ? "Edit Recruiter Profile"
//             : "Create Recruiter Profile"}
//         </h2>

//         {!profileExists && (
//           <p className="text-sm text-gray-500 mt-1">
//             Complete your recruiter profile to
//             manage recruitment activities.
//           </p>
//         )}
//       </div>

//       <div>
//         <label
//           htmlFor="designation"
//           className="block text-sm font-medium mb-2"
//         >
//           Designation
//         </label>

//         <input
//           id="designation"
//           name="designation"
//           type="text"
//           placeholder="e.g. HR Manager"
//           value={formData.designation}
//           onChange={handleChange}
//           className="border p-3 rounded-lg w-full"
//           required
//         />
//       </div>

//       <div>
//         <label
//           htmlFor="companyId"
//           className="block text-sm font-medium mb-2"
//         >
//           Company ID
//         </label>

//         <input
//           id="companyId"
//           name="companyId"
//           type="text"
//           placeholder="Optional"
//           value={formData.companyId}
//           onChange={handleChange}
//           className="border p-3 rounded-lg w-full"
//         />

//         <p className="text-xs text-gray-500 mt-2">
//           Leave this empty if you do not have a
//           company ID yet.
//         </p>
//       </div>

//       <div className="flex gap-3">
//         <button
//           type="submit"
//           disabled={saving}
//           className="bg-black text-white px-5 py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50"
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
//             className="border px-5 py-3 rounded-lg hover:bg-gray-50"
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

  /*
   * =========================
   * Load Recruiter Profile
   * =========================
   */

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response =
          await getRecruiterProfile();

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

  /*
   * =========================
   * Handle Input Change
   * =========================
   */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /*
   * =========================
   * Submit
   * =========================
   */

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

  /*
   * =========================
   * Loading
   * =========================
   */

  if (loading) {
    return (
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex min-h-55 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />

            <p className="text-sm font-semibold text-slate-700">
              Loading recruiter profile...
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
              {/* Avatar */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-lg font-bold text-blue-700">
                RP
              </div>

              {/* Title */}
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                  Recruiter Profile
                </h2>

                <div className="mt-1 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />

                  <p className="text-sm font-medium text-emerald-600">
                    Profile created successfully
                  </p>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="inline-flex h-10 items-center justify-center rounded-lg bg-slate-900 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Profile Information */}
        <div className="p-6 sm:p-8">
          <div className="mb-6">
            <h3 className="text-base font-semibold text-slate-900">
              Professional Information
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Your recruiter information used on the platform.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Designation */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Designation
              </p>

              <p className="mt-2 wrap-break-word text-base font-semibold text-slate-900">
                {formData.designation ||
                  "Not provided"}
              </p>
            </div>

            {/* Company ID */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Company ID
              </p>

              <p className="mt-2 break-all text-sm font-semibold text-slate-900">
                {formData.companyId ||
                  "Not provided"}
              </p>
            </div>
          </div>

          {/* Recruiter Info Notice */}
          <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50/60 p-5">
            <div className="flex gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                i
              </div>

              <div>
                <h4 className="text-sm font-semibold text-blue-900">
                  Recruiter Account
                </h4>

                <p className="mt-1 text-sm leading-6 text-blue-800">
                  Keep your recruiter information accurate
                  so that candidates can better understand
                  your role and organization.
                </p>
              </div>
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
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-lg font-bold text-blue-700">
            RP
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              {profileExists
                ? "Edit Recruiter Profile"
                : "Create Recruiter Profile"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {profileExists
                ? "Keep your recruiter information up to date."
                : "Add your professional information to complete your recruiter profile."}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8 p-6 sm:p-8">
        {/* Professional Information */}
        <section>
          <div className="mb-5">
            <h3 className="text-base font-semibold text-slate-900">
              Professional Information
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Enter your current role and company information.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Designation */}
            <div>
              <label
                htmlFor="designation"
                className="mb-2 block text-sm font-medium text-slate-700"
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
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              />

              <p className="mt-2 text-xs text-slate-500">
                Enter your current professional designation.
              </p>
            </div>

            {/* Company ID */}
            <div>
              <label
                htmlFor="companyId"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Company ID
              </label>

              <input
                id="companyId"
                name="companyId"
                type="text"
                placeholder="Enter company ID"
                value={formData.companyId}
                onChange={handleChange}
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <p className="mt-2 text-xs text-slate-500">
                Optional. Leave this empty if you do not have
                a company ID yet.
              </p>
            </div>
          </div>
        </section>

        {/* Information Notice */}
        <section className="border-t border-slate-200 pt-8">
          <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-5">
            <div className="flex gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-700">
                i
              </div>

              <div>
                <h4 className="text-sm font-semibold text-blue-900">
                  Profile Information
                </h4>

                <p className="mt-1 text-sm leading-6 text-blue-800">
                  Your recruiter profile helps maintain
                  professional information associated with
                  your recruitment activities.
                </p>
              </div>
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