import { useState, type FormEvent } from "react";
import { SIGNUP_ENDPOINT } from "@/config/site";

export function SignupForm({ cta, id }: { cta: string; id: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const live = Boolean(SIGNUP_ENDPOINT);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!live || !SIGNUP_ENDPOINT) return;
    setState("loading");
    try {
      const r = await fetch(SIGNUP_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      setState(r.ok ? "done" : "error");
    } catch { setState("error"); }
  }

  return (
    <form onSubmit={submit} className="w-full max-w-md">
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor={id} className="sr-only">Email address</label>
        <input id={id} type="email" required disabled={!live} value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="you@builder.dev"
          className="h-12 flex-1 rounded-sm border border-input bg-background/60 px-4 font-mono text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60" />
        <button type="submit" disabled={!live || state === "loading"}
          className="h-12 rounded-sm bg-primary px-6 font-mono text-xs font-bold uppercase tracking-[0.18em] text-primary-foreground transition hover:glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-70">
          {state === "loading" ? "Sending…" : cta}
        </button>
      </div>
      <p className="mt-3 font-mono text-[0.7rem] uppercase tracking-widest text-muted-foreground" aria-live="polite">
        {!live && "Preview only · signup list opens soon"}
        {state === "done" && "You're on the list. See you offstage."}
        {state === "error" && "Something went wrong. Try again."}
      </p>
    </form>
  );
}
