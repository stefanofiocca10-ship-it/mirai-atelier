"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/brand/Logo";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const res = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      });
      if (res?.error) {
        setError("Credenziali non valide. Riprova.");
        setPending(false);
        return;
      }
      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("Accesso non riuscito.");
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-4">
      <div className="mb-8">
        <Logo size="md" href={null} />
      </div>
      <div className="w-full max-w-md border border-line bg-paper-soft p-8 shadow-soft">
        <p className="label-atelier text-center">Admin</p>
        <h1 className="mt-3 text-center font-display text-2xl text-ink">
          Accedi
        </h1>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <label className="block text-sm">
            <span className="mb-2 block text-muted">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field-atelier"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-2 block text-muted">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="field-atelier"
            />
          </label>

          {error && (
            <p className="text-sm text-red-700" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="btn-primary w-full disabled:opacity-60"
          >
            {pending ? "Accesso…" : "Entra"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-paper text-muted">
          Caricamento…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
