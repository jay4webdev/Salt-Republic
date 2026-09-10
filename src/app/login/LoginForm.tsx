"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Unable to sign in.");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Unable to reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm space-y-6" noValidate>
      <div>
        <label htmlFor="email" className="field-label text-ivory!">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="field-input border-ivory/25! bg-white/[0.06]! text-ivory! placeholder:text-ivory/35!"
          placeholder="admin@saltrepublic.mv"
        />
      </div>
      <div>
        <label htmlFor="password" className="field-label text-ivory!">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="field-input border-ivory/25! bg-white/[0.06]! text-ivory! placeholder:text-ivory/35!"
          placeholder="Your password"
        />
      </div>
      {error ? (
        <p role="alert" className="text-sm text-red-300">
          {error}
        </p>
      ) : null}
      <button type="submit" disabled={loading} className="btn btn-light w-full">
        {loading ? "Signing in…" : "Sign In"}
      </button>
      <p className="text-center text-xs leading-relaxed text-ivory/45">
        Demo credentials — admin@saltrepublic.mv / saltrepublic
      </p>
    </form>
  );
}
