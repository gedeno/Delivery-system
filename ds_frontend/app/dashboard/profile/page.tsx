"use client";
 
// components/OwnerProfilePage.tsx
import { useState, type Dispatch, type FormEvent, type SetStateAction } from "react";
import { AlertCircle, CheckCircle2, Circle, LogOut } from "lucide-react";
import Input from "@/components/Ui/Input";
import Button from "@/components/Ui/Button";
 
/* ---------- types ---------- */
 
export interface OwnerProfile {
  full_name: string;
  email: string;
  phone: string;
}
 
export interface NotificationPrefs {
  new_orders: boolean;
  order_updates: boolean;
  weekly_summary: boolean;
  tips_and_news: boolean;
}
 
type Props = {
  /** Current owner details (replace the mock with your API data). */
  user?: OwnerProfile;
  restaurantCount?: number;
  memberSince?: string; // e.g. "March 2025"
  prefs?: NotificationPrefs;
  /** Each handler is optional. Throw an error inside one to show the "couldn't save" message. */
  onSaveProfile?: (profile: OwnerProfile) => void | Promise<void>;
  onChangePassword?: (current: string, next: string) => void | Promise<void>;
  onSavePrefs?: (prefs: NotificationPrefs) => void | Promise<void>;
  onSignOut?: () => void | Promise<void>;
};
 
/* ---------- mock data (used until you pass real data) ---------- */
 
const mockUser: OwnerProfile = {
  full_name: "Alex Morgan",
  email: "alex@maplekitchen.com",
  phone: "(555) 120-4471",
};
 
const mockPrefs: NotificationPrefs = {
  new_orders: true,
  order_updates: true,
  weekly_summary: false,
  tips_and_news: false,
};
 
const prefRows: { key: keyof NotificationPrefs; label: string; hint: string }[] = [
  { key: "new_orders", label: "New orders", hint: "Get alerted the moment a customer places an order." },
  { key: "order_updates", label: "Order updates", hint: "Cancellations, courier pickups and delivery confirmations." },
  { key: "weekly_summary", label: "Weekly summary", hint: "A Monday email with last week’s revenue and top dishes." },
  { key: "tips_and_news", label: "Tips & news", hint: "Occasional product updates and ideas to grow your kitchen." },
];
 
/* ---------- helpers ---------- */
 
type Flow = { submitted: boolean; saving: boolean; done: boolean; failed: boolean };
const idle: Flow = { submitted: false, saving: false, done: false, failed: false };
 
const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
 
const panel =
  "rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md focus-within:border-[#237a57]/40 sm:p-6";
const heading = "text-[15px] font-bold text-[#1b2b24]";
 
/** Runs one section's save: validates, shows saving/done/failed, and never double-submits. */
async function runFlow(
  setFlow: Dispatch<SetStateAction<Flow>>,
  valid: boolean,
  task: () => void | Promise<void>,
  onDone?: () => void
) {
  setFlow((f) => ({ ...f, submitted: true }));
  if (!valid) {
    setFlow((f) => ({ ...f, done: false }));
    return;
  }
  setFlow((f) => ({ ...f, saving: true, failed: false }));
  try {
    await task();
    setFlow((f) => ({ ...f, done: true }));
    onDone?.();
  } catch {
    setFlow((f) => ({ ...f, failed: true, done: false }));
  } finally {
    setFlow((f) => ({ ...f, saving: false }));
  }
}
 
const clearNotice = (setFlow: Dispatch<SetStateAction<Flow>>) =>
  setFlow((f) => ({ ...f, done: false, failed: false }));
 
function Notice({ kind, title, text }: { kind: "ok" | "error"; title: string; text?: string }) {
  const ok = kind === "ok";
  return (
    <div role={ok ? "status" : "alert"} className={`mt-5 flex gap-3 rounded-xl p-4 ${ok ? "bg-[#e6f0ea]" : "bg-[#fdeee6]"}`}>
      {ok ? (
        <CheckCircle2 size={16} aria-hidden className="mt-0.5 shrink-0 text-[#237a57]" />
      ) : (
        <AlertCircle size={16} aria-hidden className="mt-0.5 shrink-0 text-[#d4472f]" />
      )}
      <div>
        <p className="text-[12px] font-bold">{title}</p>
        {text && <p className="mt-1 text-[11px] text-neutral-600">{text}</p>}
      </div>
    </div>
  );
}
 
function Switch({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#237a57] focus-visible:ring-offset-2 ${
        checked ? "bg-[#237a57]" : "bg-neutral-300"
      }`}
    >
      <span
        className={`inline-block size-5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}
 
/* ---------- main component ---------- */
 
export default function OwnerProfilePage({
  user = mockUser,
  restaurantCount = 2,
  memberSince = "March 2025",
  prefs = mockPrefs,
  onSaveProfile,
  onChangePassword,
  onSavePrefs,
  onSignOut,
}: Props) {
  /* personal details */
  const [profile, setProfile] = useState<OwnerProfile>(user);
  const [saved, setSaved] = useState<OwnerProfile>(user); // what the header card shows
  const [pFlow, setPFlow] = useState<Flow>(idle);
 
  const pErrors: Partial<Record<keyof OwnerProfile, string>> = {};
  if (profile.full_name.trim().length < 2) pErrors.full_name = "Enter your full name.";
  if (!/^\S+@\S+\.\S+$/.test(profile.email)) pErrors.email = "Enter a valid email address.";
  if (profile.phone.replace(/\D/g, "").length < 10) pErrors.phone = "Enter a valid phone number.";
  const shownP = pFlow.submitted ? pErrors : {};
 
  const setField = (key: keyof OwnerProfile) => (e: { target: { value: string } }) => {
    clearNotice(setPFlow);
    setProfile((p) => ({ ...p, [key]: e.target.value }));
  };
 
  function saveProfile(e: FormEvent) {
    e.preventDefault();
    const clean: OwnerProfile = {
      full_name: profile.full_name.trim(),
      email: profile.email.trim(),
      phone: profile.phone.trim(),
    };
    runFlow(setPFlow, Object.keys(pErrors).length === 0, () => onSaveProfile?.(clean), () => setSaved(clean));
  }
 
  /* password */
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [wFlow, setWFlow] = useState<Flow>(idle);
 
  const rules = [
    { ok: pw.next.length >= 8, label: "At least 8 characters" },
    { ok: /[A-Za-z]/.test(pw.next) && /\d/.test(pw.next), label: "A letter and a number" },
    { ok: pw.next !== "" && pw.next === pw.confirm, label: "Both passwords match" },
  ];
 
  const wErrors: Partial<Record<keyof typeof pw, string>> = {};
  if (!pw.current) wErrors.current = "Enter your current password.";
  if (!rules[0].ok || !rules[1].ok) wErrors.next = "Use at least 8 characters, with a letter and a number.";
  else if (pw.next === pw.current) wErrors.next = "Choose a different password than your current one.";
  if (!rules[2].ok) wErrors.confirm = "The two passwords don’t match.";
  const shownW = wFlow.submitted ? wErrors : {};
 
  const setPwField = (key: keyof typeof pw) => (e: { target: { value: string } }) => {
    clearNotice(setWFlow);
    setPw((p) => ({ ...p, [key]: e.target.value }));
  };
 
  function savePassword(e: FormEvent) {
    e.preventDefault();
    runFlow(
      setWFlow,
      Object.keys(wErrors).length === 0,
      () => onChangePassword?.(pw.current, pw.next),
      () => {
        setPw({ current: "", next: "", confirm: "" });
        setWFlow((f) => ({ ...f, submitted: false }));
      }
    );
  }
 
  /* notification preferences */
  const [prefState, setPrefState] = useState<NotificationPrefs>(prefs);
  const [nFlow, setNFlow] = useState<Flow>(idle);
 
  const togglePref = (key: keyof NotificationPrefs) => {
    clearNotice(setNFlow);
    setPrefState((p) => ({ ...p, [key]: !p[key] }));
  };
 
  /* sign out */
  const [signingOut, setSigningOut] = useState(false);
  async function signOut() {
    setSigningOut(true);
    try {
      await onSignOut?.();
    } finally {
      setSigningOut(false);
    }
  }
 
  return (
    <div className="min-h-screen w-full bg-[#faf8f4] px-4 py-6 text-[#1b2b24] sm:px-8 lg:px-10">
      {/* Heading */}
      <header>
        <p className="text-[10px] font-bold uppercase tracking-wide text-[#237a57]">Vendor workspace</p>
        <h1 className="mt-2 text-[26px] font-bold tracking-tight sm:text-[32px]">Profile</h1>
        <p className="mt-2 text-[13px] text-neutral-500">
          Manage your personal details, password and how we keep you in the loop.
        </p>
      </header>
 
      <div className="mt-6 grid items-start gap-6 xl:grid-cols-[340px_1fr]">
        {/* ---------- left: identity ---------- */}
        <aside className="space-y-4 xl:sticky xl:top-6">
          <section className={`${panel} text-center`}>
            <div
              aria-hidden
              className="mx-auto grid size-20 place-items-center rounded-2xl bg-[#8a5a1f] text-[26px] font-bold text-white shadow-sm"
            >
              {initials(saved.full_name) || "?"}
            </div>
            <h2 className="mt-4 truncate text-[18px] font-bold">{saved.full_name}</h2>
            <p className="mt-1 truncate text-[12px] text-neutral-500">{saved.email}</p>
            <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#e3f1ea] px-3 py-1.5 text-[11px] font-semibold text-[#237a57]">
              <span className="size-1.5 rounded-full bg-[#237a57]" />
              Restaurant owner
            </span>
 
            <dl className="mt-5 grid grid-cols-2 divide-x divide-neutral-200 rounded-2xl bg-[#faf8f4] py-3 text-left">
              <div className="px-4">
                <dd className="font-mono text-[17px] font-semibold tabular-nums">{restaurantCount}</dd>
                <dt className="mt-0.5 text-[11px] text-neutral-500">Restaurants</dt>
              </div>
              <div className="px-4">
                <dd className="text-[14px] font-semibold leading-[1.6]">{memberSince}</dd>
                <dt className="mt-0.5 text-[11px] text-neutral-500">Member since</dt>
              </div>
            </dl>
          </section>
 
          <section className="rounded-2xl bg-[#e6f0ea] p-5">
            <h3 className="text-[14px] font-bold">Good food. Good neighbors.</h3>
            <p className="mt-2 text-[11px] text-neutral-600">Need a hand with your account? Our local support team is here.</p>
            <Button variant="light" href="/support" className="mt-3">
              Contact support ↗
            </Button>
          </section>
        </aside>
 
        {/* ---------- right: forms ---------- */}
        <div className="min-w-0 space-y-6">
          {/* Personal details */}
          <form onSubmit={saveProfile} noValidate className={panel}>
            <h2 className={heading}>Personal details</h2>
            <div className="mt-5 grid gap-x-6 gap-y-5 sm:grid-cols-2">
              <Input
                label="Full name"
                name="full_name"
                className="sm:col-span-2"
                autoComplete="name"
                value={profile.full_name}
                onChange={setField("full_name")}
                error={shownP.full_name}
              />
              <Input
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                value={profile.email}
                onChange={setField("email")}
                error={shownP.email}
              />
              <Input
                label="Phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={profile.phone}
                onChange={setField("phone")}
                error={shownP.phone}
              />
            </div>
            <div aria-live="polite">
              {pFlow.done && <Notice kind="ok" title="Details saved" text="Your profile is up to date." />}
              {pFlow.failed && <Notice kind="error" title="We couldn’t save your details" text="Check your connection and try again." />}
            </div>
            <div className="mt-5 flex justify-end">
              <Button type="submit" disabled={pFlow.saving} className="w-full sm:w-auto">
                {pFlow.saving ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </form>
 
          {/* Password */}
          <form onSubmit={savePassword} noValidate className={panel}>
            <h2 className={heading}>Change password</h2>
            <div className="mt-5 grid gap-x-6 gap-y-5 sm:grid-cols-2">
              <Input
                label="Current password"
                name="current_password"
                type="password"
                className="sm:col-span-2"
                autoComplete="current-password"
                value={pw.current}
                onChange={setPwField("current")}
                error={shownW.current}
              />
              <Input
                label="New password"
                name="new_password"
                type="password"
                autoComplete="new-password"
                value={pw.next}
                onChange={setPwField("next")}
                error={shownW.next}
              />
              <Input
                label="Confirm new password"
                name="confirm_password"
                type="password"
                autoComplete="new-password"
                value={pw.confirm}
                onChange={setPwField("confirm")}
                error={shownW.confirm}
              />
            </div>
 
            <ul className="mt-4 grid gap-1.5 text-[11px] sm:grid-cols-3">
              {rules.map((r) => (
                <li key={r.label} className={`flex items-center gap-1.5 ${r.ok ? "text-[#237a57]" : "text-neutral-500"}`}>
                  {r.ok ? <CheckCircle2 size={13} aria-hidden /> : <Circle size={13} aria-hidden />}
                  {r.label}
                </li>
              ))}
            </ul>
 
            <div aria-live="polite">
              {wFlow.done && <Notice kind="ok" title="Password updated" text="Use your new password next time you sign in." />}
              {wFlow.failed && (
                <Notice kind="error" title="We couldn’t update your password" text="Check your current password and try again." />
              )}
            </div>
            <div className="mt-5 flex justify-end">
              <Button type="submit" disabled={wFlow.saving} className="w-full sm:w-auto">
                {wFlow.saving ? "Updating…" : "Update password"}
              </Button>
            </div>
          </form>
 
          {/* Notifications */}
          <section className={panel}>
            <h2 className={heading}>Notifications</h2>
            <ul className="mt-2 divide-y divide-neutral-100">
              {prefRows.map((row) => (
                <li key={row.key} className="flex items-center justify-between gap-4 py-4">
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold">{row.label}</p>
                    <p className="mt-0.5 text-[11px] text-neutral-500">{row.hint}</p>
                  </div>
                  <Switch checked={prefState[row.key]} onChange={() => togglePref(row.key)} label={row.label} />
                </li>
              ))}
            </ul>
            <div aria-live="polite">
              {nFlow.done && <Notice kind="ok" title="Preferences saved" />}
              {nFlow.failed && <Notice kind="error" title="We couldn’t save your preferences" text="Try again in a moment." />}
            </div>
            <div className="mt-5 flex justify-end">
              <Button
                type="button"
                disabled={nFlow.saving}
                className="w-full sm:w-auto"
                onClick={() => runFlow(setNFlow, true, () => onSavePrefs?.(prefState))}
              >
                {nFlow.saving ? "Saving…" : "Save preferences"}
              </Button>
            </div>
          </section>
 
          {/* Sign out */}
          <section className={`${panel} flex flex-wrap items-center justify-between gap-4`}>
            <div>
              <h2 className={heading}>Sign out</h2>
              <p className="mt-1 text-[11px] text-neutral-500">You’ll need to sign in again to manage your restaurants.</p>
            </div>
            <Button type="button" variant="outline" disabled={signingOut} onClick={signOut} className="w-full sm:w-auto">
              <LogOut size={14} aria-hidden /> {signingOut ? "Signing out…" : "Sign out"}
            </Button>
          </section>
        </div>
      </div>
    </div>
  );
}
 