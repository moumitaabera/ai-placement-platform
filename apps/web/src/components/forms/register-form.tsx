// "use client";

// import axios from "axios";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { register } from "@/services/auth.service";
// import { RegisterData } from "@/types/auth";
// import { Button } from "@/components/ui/button";

// export default function RegisterForm() {
//   const router = useRouter();

//   const [form, setForm] = useState<RegisterData>({
//     name: "",
//     email: "",
//     password: "",
//     role: "STUDENT",
//   });

//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const password = form.password;

//   const passwordRequirements = {
//     length: password.length >= 8,
//     uppercase: /[A-Z]/.test(password),
//     lowercase: /[a-z]/.test(password),
//     number: /[0-9]/.test(password),
//     special: /[^A-Za-z0-9]/.test(password),
//   };

//   const isPasswordStrong =
//     passwordRequirements.length &&
//     passwordRequirements.uppercase &&
//     passwordRequirements.lowercase &&
//     passwordRequirements.number &&
//     passwordRequirements.special;

//   const passwordsMatch =
//     password.length > 0 &&
//     confirmPassword.length > 0 &&
//     password === confirmPassword;

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!isPasswordStrong) {
//       alert("Please create a strong password.");
//       return;
//     }

//     if (password !== confirmPassword) {
//       alert("Passwords do not match.");
//       return;
//     }

//     try {
//       setLoading(true);

//       const result = await register(form);

//       console.log(result);

//       alert("Registration successful!");

//       router.push("/login");
//     } catch (error: unknown) {
//       console.error("Registration error:", error);

//       if (axios.isAxiosError(error)) {
//         console.error("Backend response:", error.response?.data);

//         const backendMessage = error.response?.data?.message;

//         alert(
//           backendMessage ||
//             error.response?.data?.error ||
//             "Registration failed!"
//         );
//       } else {
//         alert("Registration failed!");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="space-y-5 w-full max-w-md"
//     >
//       {/* Name */}
//       <div className="space-y-2">
//         <label
//           htmlFor="name"
//           className="text-sm font-medium"
//         >
//           Full Name
//         </label>

//         <input
//           id="name"
//           name="name"
//           placeholder="Full Name"
//           value={form.name}
//           onChange={handleChange}
//           required
//           className="w-full border rounded-lg p-3"
//         />
//       </div>

//       {/* Email */}
//       <div className="space-y-2">
//         <label
//           htmlFor="email"
//           className="text-sm font-medium"
//         >
//           Email
//         </label>

//         <input
//           id="email"
//           name="email"
//           type="email"
//           placeholder="Email"
//           value={form.email}
//           onChange={handleChange}
//           required
//           className="w-full border rounded-lg p-3"
//         />
//       </div>

//       {/* Password */}
//       <div className="space-y-2">
//         <label
//           htmlFor="password"
//           className="text-sm font-medium"
//         >
//           Password
//         </label>

//         <input
//           id="password"
//           name="password"
//           type="password"
//           placeholder="Create a strong password"
//           value={form.password}
//           onChange={handleChange}
//           required
//           className="w-full border rounded-lg p-3"
//         />

//         {/* Password requirements */}
//         <div className="rounded-lg border bg-gray-50 p-3 text-sm space-y-1">
//           <p className="font-medium mb-2">
//             Password must contain:
//           </p>

//           <PasswordRequirement
//             valid={passwordRequirements.length}
//             text="At least 8 characters"
//           />

//           <PasswordRequirement
//             valid={passwordRequirements.uppercase}
//             text="One uppercase letter"
//           />

//           <PasswordRequirement
//             valid={passwordRequirements.lowercase}
//             text="One lowercase letter"
//           />

//           <PasswordRequirement
//             valid={passwordRequirements.number}
//             text="One number"
//           />

//           <PasswordRequirement
//             valid={passwordRequirements.special}
//             text="One special character"
//           />
//         </div>
//       </div>

//       {/* Confirm Password */}
//       <div className="space-y-2">
//         <label
//           htmlFor="confirmPassword"
//           className="text-sm font-medium"
//         >
//           Confirm Password
//         </label>

//         <input
//           id="confirmPassword"
//           name="confirmPassword"
//           type="password"
//           placeholder="Confirm your password"
//           value={confirmPassword}
//           onChange={(e) =>
//             setConfirmPassword(e.target.value)
//           }
//           required
//           className="w-full border rounded-lg p-3"
//         />

//         {/* Match message */}
//         {confirmPassword.length > 0 && (
//           <p
//             className={`text-sm ${
//               passwordsMatch
//                 ? "text-green-600"
//                 : "text-red-600"
//             }`}
//           >
//             {passwordsMatch
//               ? "✓ Passwords match"
//               : "✗ Passwords do not match"}
//           </p>
//         )}
//       </div>

//       {/* Role */}
//       <div className="space-y-2">
//         <label
//           htmlFor="role"
//           className="text-sm font-medium"
//         >
//           Register as
//         </label>

//         <select
//           id="role"
//           name="role"
//           value={form.role}
//           onChange={handleChange}
//           className="w-full border rounded-lg p-3"
//         >
//           <option value="STUDENT">Student</option>
//           <option value="RECRUITER">Recruiter</option>
//         </select>
//       </div>

//       {/* Submit */}
//       <Button
//         type="submit"
//         className="w-full"
//         disabled={
//           loading ||
//           !isPasswordStrong ||
//           !passwordsMatch
//         }
//       >
//         {loading
//           ? "Creating account..."
//           : "Create Account"}
//       </Button>
//     </form>
//   );
// }

// function PasswordRequirement({
//   valid,
//   text,
// }: {
//   valid: boolean;
//   text: string;
// }) {
//   return (
//     <p
//       className={
//         valid
//           ? "text-green-600"
//           : "text-gray-500"
//       }
//     >
//       {valid ? "✓" : "○"} {text}
//     </p>
//   );
// }


"use client";

import axios from "axios";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { register } from "@/services/auth.service";
import { RegisterData } from "@/types/auth";

export default function RegisterForm() {
  const router = useRouter();

  const [form, setForm] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
    role: "STUDENT",
  });

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const password = form.password;

  const passwordRequirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const isPasswordStrong =
    passwordRequirements.length &&
    passwordRequirements.uppercase &&
    passwordRequirements.lowercase &&
    passwordRequirements.number &&
    passwordRequirements.special;

  const passwordsMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");

    if (!isPasswordStrong) {
      setError(
        "Please create a strong password that meets all the requirements."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const result = await register(form);

      console.log(
        "Registration successful:",
        result
      );

      router.push("/login");
    } catch (error: unknown) {
      console.error(
        "Registration error:",
        error
      );

      if (axios.isAxiosError(error)) {
        const backendMessage =
          error.response?.data?.message;

        setError(
          backendMessage ||
            error.response?.data?.error ||
            "Registration failed. Please try again."
        );
      } else {
        setError(
          "Something went wrong. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md space-y-5"
    >
      {/* Error Message */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <div className="flex items-start gap-2">
            <span className="font-bold">!</span>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Full Name */}
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="text-sm font-semibold text-gray-800"
        >
          Full name
        </label>

        <input
          id="name"
          name="name"
          type="text"
          placeholder="Enter your full name"
          value={form.name}
          onChange={handleChange}
          autoComplete="name"
          required
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-2 focus:ring-black/10"
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-sm font-semibold text-gray-800"
        >
          Email address
        </label>

        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
          required
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-2 focus:ring-black/10"
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label
          htmlFor="password"
          className="text-sm font-semibold text-gray-800"
        >
          Password
        </label>

        <div className="relative">
          <input
            id="password"
            name="password"
            type={
              showPassword
                ? "text"
                : "password"
            }
            placeholder="Create a strong password"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
            required
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-20 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-2 focus:ring-black/10"
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(
                (previous) => !previous
              )
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-semibold text-gray-500 hover:bg-gray-100 hover:text-black transition"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* Password Requirements */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p className="mb-3 text-sm font-semibold text-gray-800">
            Password requirements
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <PasswordRequirement
              valid={passwordRequirements.length}
              text="8+ characters"
            />

            <PasswordRequirement
              valid={
                passwordRequirements.uppercase
              }
              text="Uppercase letter"
            />

            <PasswordRequirement
              valid={
                passwordRequirements.lowercase
              }
              text="Lowercase letter"
            />

            <PasswordRequirement
              valid={
                passwordRequirements.number
              }
              text="One number"
            />

            <PasswordRequirement
              valid={
                passwordRequirements.special
              }
              text="Special character"
            />
          </div>
        </div>
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <label
          htmlFor="confirmPassword"
          className="text-sm font-semibold text-gray-800"
        >
          Confirm password
        </label>

        <div className="relative">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={
              showConfirmPassword
                ? "text"
                : "password"
            }
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
            autoComplete="new-password"
            required
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-20 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-2 focus:ring-black/10"
          />

          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword(
                (previous) => !previous
              )
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-semibold text-gray-500 hover:bg-gray-100 hover:text-black transition"
          >
            {showConfirmPassword
              ? "Hide"
              : "Show"}
          </button>
        </div>

        {confirmPassword.length > 0 && (
          <p
            className={`text-sm font-medium ${
              passwordsMatch
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {passwordsMatch
              ? "✓ Passwords match"
              : "✗ Passwords do not match"}
          </p>
        )}
      </div>

      {/* Role */}
      <div className="space-y-2">
        <label
          htmlFor="role"
          className="text-sm font-semibold text-gray-800"
        >
          Register as
        </label>

        <select
          id="role"
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
        >
          <option value="STUDENT">
            Student
          </option>

          <option value="RECRUITER">
            Recruiter
          </option>
        </select>

        <p className="text-xs text-gray-500">
          Choose the account type that best
          describes how you will use the platform.
        </p>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={
          loading ||
          !isPasswordStrong ||
          !passwordsMatch
        }
        className="w-full rounded-xl bg-black px-4 py-3.5 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Creating account...
          </span>
        ) : (
          "Create Account"
        )}
      </button>

      {/* Login */}
      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-black underline underline-offset-4 hover:text-gray-600 transition"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}

function PasswordRequirement({
  valid,
  text,
}: {
  valid: boolean;
  text: string;
}) {
  return (
    <div
      className={`flex items-center gap-2 text-xs font-medium ${
        valid
          ? "text-green-600"
          : "text-gray-500"
      }`}
    >
      <span
        className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
          valid
            ? "bg-green-100"
            : "bg-gray-200"
        }`}
      >
        {valid ? "✓" : "○"}
      </span>

      <span>{text}</span>
    </div>
  );
}