// app/dashboard/admin/settings/page.tsx  (UI only: sample data, no state, no submit)
import Button from "@/components/Ui/Button";
import Input from "@/components/Ui/Input";

import Toggle from "@/components/Ui/admincomps/Toggle";
import type { User } from "@/app/lib/types";
import SettingsSection from "@/components/Ui/admincomps/settingssection";

/* ---------- sample data (replace with the signed-in admin) ---------- */

const me: User = {
  id: 6,
  first_name: "Robin",
  last_name: "Patel",
  username: "robinp",
  email: "robin@basilblock.example",
  role: "admin",
  phone: "(555) 640-1127",
};

const nav = [["profile", "Profile"], ["security", "Security"], ["platform", "Platform"], ["notifications", "Notifications"]];
const half = "col-span-2 sm:col-span-1";

export default function AdminSettingsPage() {
  return (
    <div className="min-h-screen w-full bg-[#faf8f4] px-4 py-6 text-[#1b2b24] sm:px-8 lg:px-10">
      <header>
        <p className="text-[10px] font-bold uppercase tracking-wide text-[#237a57]">Admin workspace</p>
        <h1 className="mt-2 text-[26px] font-bold tracking-tight sm:text-[32px]">Settings</h1>
        <p className="mt-2 text-[13px] text-neutral-500">Manage your account and how the platform runs.</p>
      </header>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[220px_1fr]">
        <nav aria-label="Settings sections" className="hidden lg:sticky lg:top-6 lg:block">
          <ul className="space-y-1">
            {nav.map(([id, label], i) => (
              <li key={id}>
                <a href={`#${id}`} className={`block rounded-xl px-4 py-2.5 text-[13px] font-semibold transition ${i === 0 ? "bg-[#e3f1ea] text-[#237a57]" : "text-neutral-500 hover:bg-white hover:text-[#1b2b24]"}`}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <form className="max-w-3xl space-y-6">
          <SettingsSection id="profile" title="Profile" hint="This is how you appear to other admins.">
            <div className="col-span-2 flex items-center gap-4">
              <span aria-hidden className="grid size-14 place-items-center rounded-full bg-gradient-to-br from-[#237a57] to-[#1b3b2f] text-[18px] font-bold text-white shadow-md ring-2 ring-white">
                {me.first_name[0]}{me.last_name[0]}
              </span>
              <div>
                <p className="text-[14px] font-semibold">{me.first_name} {me.last_name}</p>
                <span className="mt-1 inline-block rounded-full bg-[#fbe6e1] px-2.5 py-0.5 text-[10px] font-bold text-[#d4472f]">Admin</span>
              </div>
            </div>
            <Input className={half} label="First name" name="first_name" defaultValue={me.first_name} />
            <Input className={half} label="Last name" name="last_name" defaultValue={me.last_name} />
            <Input className={half} label="Username" name="username" defaultValue={me.username} />
            <Input className={half} label="Phone" name="phone" type="tel" defaultValue={me.phone} />
            <Input className="col-span-2" label="Email" name="email" type="email" defaultValue={me.email} />
          </SettingsSection>

          <SettingsSection id="security" title="Security" hint="Use a strong password you don't use anywhere else.">
            <Input className="col-span-2" label="Current password" name="current_password" type="password" placeholder="••••••••••••" />
            <Input className={half} label="New password" name="password" type="password" placeholder="••••••••••••" hint="At least 8 characters, one number and one symbol" />
            <Input className={half} label="Confirm new password" name="confirm_password" type="password" placeholder="••••••••••••" />
            <Toggle name="two_step" label="Two-step verification" hint="Required for all admin accounts." defaultChecked />
          </SettingsSection>

          <SettingsSection id="platform" title="Platform" hint="These apply to every restaurant and customer.">
            <Input className={half} label="Delivery fee (USD)" name="delivery_fee" type="number" step="0.01" defaultValue="2.49" />
            <Input className={half} label="Minimum order (USD)" name="min_order" type="number" step="0.01" defaultValue="15.00" />
            <Input className={half} label="Support email" name="support_email" type="email" defaultValue="help@basilblock.example" />
            <Input className={half} label="Support phone" name="support_phone" type="tel" defaultValue="(555) 000-0199" />
            <Toggle name="accept_orders" label="Accept new orders" hint="Turn off to pause ordering everywhere." defaultChecked />
            <Toggle name="auto_approve" label="Auto-approve new restaurants" hint="Skip manual review for new applications." />
            <Toggle name="maintenance" label="Maintenance mode" hint="Show a maintenance page to customers." />
          </SettingsSection>

          <SettingsSection id="notifications" title="Notifications" hint="Choose what lands in your inbox.">
            <Toggle name="n_applications" label="New restaurant applications" hint="When a kitchen asks to join." defaultChecked />
            <Toggle name="n_issues" label="Order issues" hint="Late, canceled or disputed orders." defaultChecked />
            <Toggle name="n_report" label="Weekly report" hint="A Monday summary of orders and revenue." />
          </SettingsSection>

          <div className="flex flex-wrap gap-3">
            <Button type="submit">Save changes</Button>
            <Button variant="outline">Discard</Button>
          </div>
        </form>
      </div>
    </div>
  );
}