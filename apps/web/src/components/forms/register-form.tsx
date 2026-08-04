"use client";

import { useState } from "react";
import { register } from "@/services/auth.service";
import { RegisterData } from "@/types/auth";
import { Button } from "@/components/ui/button";

export default function RegisterForm() {
  const [form, setForm] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
    role: "STUDENT",
  });

  const [loading, setLoading] = useState(false);

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

    try {
      setLoading(true);

      const result = await register(form);

      console.log(result);

      alert("Registration successful!");
    } catch (error) {
      console.error(error);
      alert("Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 w-full max-w-md"
    >
      <input
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
        className="w-full border rounded-lg p-3"
      />

      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="w-full border rounded-lg p-3"
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        className="w-full border rounded-lg p-3"
      />

      <select
        name="role"
        value={form.role}
        onChange={handleChange}
        className="w-full border rounded-lg p-3"
      >
        <option value="STUDENT">Student</option>
        <option value="RECRUITER">Recruiter</option>
      </select>

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? "Creating account..." : "Create Account"}
      </Button>
    </form>
  );
}