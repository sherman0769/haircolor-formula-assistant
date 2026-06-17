"use client";

import { FormEvent, useId, useState } from "react";
import { LockKeyhole, LogIn, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";

export const ADMIN_STORAGE_KEY = "haircolor-admin-unlocked";
export const ADMIN_ACCESS_EVENT = "haircolor-admin-access-changed";

const DEMO_ADMIN_PASSWORD = "2610874";

type AdminAccessButtonProps = {
  buttonLabel?: string;
  className?: string;
  redirectTo?: string;
  onUnlocked?: () => void;
};

export function AdminAccessButton({
  buttonLabel = "規則控制端",
  className = "",
  redirectTo = "/admin/rules",
  onUnlocked,
}: AdminAccessButtonProps) {
  const router = useRouter();
  const passwordId = useId();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password.trim() !== DEMO_ADMIN_PASSWORD) {
      setError("密碼不正確，請重新確認。");
      return;
    }

    window.sessionStorage.setItem(ADMIN_STORAGE_KEY, "true");
    window.dispatchEvent(new Event(ADMIN_ACCESS_EVENT));
    setError("");
    setPassword("");

    if (onUnlocked) {
      onUnlocked();
      return;
    }

    router.push(redirectTo);
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-border bg-panel px-4 text-sm font-semibold text-foreground shadow-sm transition hover:border-accent hover:text-accent sm:w-auto"
      >
        <LockKeyhole aria-hidden="true" className="size-4" />
        {buttonLabel}
      </button>

      {open && (
        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-border bg-panel p-4 shadow-sm"
        >
          <label
            htmlFor={passwordId}
            className="text-sm font-semibold text-foreground"
          >
            控制端密碼
          </label>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              id={passwordId}
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
              className="min-h-11 flex-1 rounded-md border border-border bg-white px-3 text-base outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              autoComplete="off"
            />
            <button
              type="submit"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-accent px-4 text-sm font-semibold text-accent-foreground hover:bg-teal-800"
            >
              <LogIn aria-hidden="true" className="size-4" />
              進入
            </button>
          </div>
          {error && (
            <p className="mt-3 text-sm font-medium text-danger">{error}</p>
          )}
          <p className="mt-3 flex gap-2 text-xs leading-5 text-muted-foreground">
            <ShieldAlert
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-warning"
            />
            目前為 MVP 展示用簡易密碼，不代表正式權限控管；正式控制端仍需登入、權限與審核流程。
          </p>
        </form>
      )}
    </div>
  );
}
