"use client";

import { useState } from "react";
import { login } from "@/services/auth.service";
import { saveTokens } from "@/lib/auth";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
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
    } catch (error: unknown) {
      console.error(error);
      alert("Login failed!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          required
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label>Password</label>

        <input
          type="password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          required
          className="border p-2 w-full"
        />
      </div>

      <button
        type="submit"
        className="bg-black text-white px-4 py-2 rounded"
      >
        Login
      </button>
    </form>
  );
}