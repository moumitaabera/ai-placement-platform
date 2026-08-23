"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/services/auth.service";
import { saveTokens } from "@/lib/auth";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await login({
        email,
        password,
      });

      console.log("Login successful:", response);

      saveTokens(
        response.data.accessToken,
        response.data.refreshToken
      );

      alert("Login successful!");

      if (response.data.user.role === "ADMIN") {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (error: unknown) {
      console.error(error);
      alert("Login failed!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md space-y-4"
    >
      <div>
        <label>Email</label>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label>Password</label>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border p-2 w-full"
        />
      </div>

      <button
        type="submit"
        className="bg-black text-white px-4 py-2 rounded w-full"
      >
        Login
      </button>

      <p className="text-center text-sm">
        Dont have an account?{" "}
        <Link
          href="/register"
          className="font-semibold underline"
        >
          Register
        </Link>
      </p>
    </form>
  );
}