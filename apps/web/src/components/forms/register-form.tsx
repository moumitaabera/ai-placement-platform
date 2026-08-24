"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/services/auth.service";
import { RegisterData } from "@/types/auth";
import { Button } from "@/components/ui/button";

export default function RegisterForm() {
  const router = useRouter();

  const [form, setForm] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
    role: "STUDENT",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPasswordStrong) {
      alert("Please create a strong password.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const result = await register(form);

      console.log(result);

      alert("Registration successful!");

      router.push("/login");
    } catch (error: unknown) {
      console.error("Registration error:", error);

      if (axios.isAxiosError(error)) {
        console.error("Backend response:", error.response?.data);

        const backendMessage = error.response?.data?.message;

        alert(
          backendMessage ||
            error.response?.data?.error ||
            "Registration failed!"
        );
      } else {
        alert("Registration failed!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 w-full max-w-md"
    >
      {/* Name */}
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="text-sm font-medium"
        >
          Full Name
        </label>

        <input
          id="name"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-3"
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-sm font-medium"
        >
          Email
        </label>

        <input
          id="email"
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-3"
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label
          htmlFor="password"
          className="text-sm font-medium"
        >
          Password
        </label>

        <input
          id="password"
          name="password"
          type="password"
          placeholder="Create a strong password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-3"
        />

        {/* Password requirements */}
        <div className="rounded-lg border bg-gray-50 p-3 text-sm space-y-1">
          <p className="font-medium mb-2">
            Password must contain:
          </p>

          <PasswordRequirement
            valid={passwordRequirements.length}
            text="At least 8 characters"
          />

          <PasswordRequirement
            valid={passwordRequirements.uppercase}
            text="One uppercase letter"
          />

          <PasswordRequirement
            valid={passwordRequirements.lowercase}
            text="One lowercase letter"
          />

          <PasswordRequirement
            valid={passwordRequirements.number}
            text="One number"
          />

          <PasswordRequirement
            valid={passwordRequirements.special}
            text="One special character"
          />
        </div>
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <label
          htmlFor="confirmPassword"
          className="text-sm font-medium"
        >
          Confirm Password
        </label>

        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(e.target.value)
          }
          required
          className="w-full border rounded-lg p-3"
        />

        {/* Match message */}
        {confirmPassword.length > 0 && (
          <p
            className={`text-sm ${
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
          className="text-sm font-medium"
        >
          Register as
        </label>

        <select
          id="role"
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
        >
          <option value="STUDENT">Student</option>
          <option value="RECRUITER">Recruiter</option>
        </select>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        className="w-full"
        disabled={
          loading ||
          !isPasswordStrong ||
          !passwordsMatch
        }
      >
        {loading
          ? "Creating account..."
          : "Create Account"}
      </Button>
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
    <p
      className={
        valid
          ? "text-green-600"
          : "text-gray-500"
      }
    >
      {valid ? "✓" : "○"} {text}
    </p>
  );
}