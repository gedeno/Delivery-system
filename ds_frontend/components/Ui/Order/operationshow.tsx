"use client";

// components/OperationsShowcase.tsx
import { useState } from "react";
import { AlertCircle, CheckCircle2, ShoppingBag, X } from "lucide-react";
import Input from "../Input";
import Button from "../Button";

/* ---------- data ---------- */

const timeline = [
  { label: "Order confirmed · 12:08 PM", state: "done" },
  { label: "Preparing your food · 12:12 PM", state: "done" },
  { label: "Jamie is on the way · 12:26 PM", state: "current" },
  { label: "Delivered · Estimated 12:42 PM", state: "todo" },
] as const;

const revenue = [
  { day: "Mon", value: 540 },
  { day: "Tue", value: 602 },
  { day: "Wed", value: 590 },
  { day: "Thu", value: 710 },
  { day: "Fri", value: 685 },
];
const CHART_MAX = 800;

type Tone = "red" | "amber" | "green" | "grey";
const tones: Record<Tone, string> = {
  red: "bg-[#fbe6e1] text-[#d4472f]",
  amber: "bg-[#fdf0c9] text-[#8a6100]",
  green: "bg-[#e3f1ea] text-[#237a57]",
  grey: "bg-neutral-100 text-neutral-500",
};

const orders = [
  { id: "#BB-1048", customer: "Alex Morgan", total: "$40.84", status: "On the way", tone: "amber" as Tone },
  { id: "#BB-1049", customer: "Taylor Reed", total: "$34.20", status: "New", tone: "red" as Tone },
];

/* ---------- helpers ---------- */

const panel = "rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm";
const heading = "text-[15px] font-bold text-[#1b2b24]";

function Badge({ label, tone }: { label: string; tone: Tone }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${tones[tone]}`}>
      {label}
    </span>
  );
}

function Pin({ x, y, fill, children }: { x: number; y: number; fill: string; children: React.ReactNode }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r="10" fill={fill} stroke="#fff" strokeWidth="2" />
      {children}
    </g>
  );
}

/* ---------- main component ---------- */

export default function OperationsShowcase() {
  const [name, setName] = useState("Harvest chicken bowl");
  const [price, setPrice] = useState("$14.50");
  const [available, setAvailable] = useState(true);
  const [modalOpen, setModalOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#faf8f4] px-4 py-8 text-[#1b2b24] sm:px-8">
      <div className="mx-auto grid w-full gap-5  ">
        {/* ================= LEFT COLUMN ================= */}
        <div className=" grid  gap-6 lg:grid-cols-2 items-center ">
            {/* Order timeline */}
            <section className={panel}>
            <h2 className={heading}>Order timeline</h2>
            <ol className="mt-4 space-y-3 text-[12px]">
              {timeline.map((t) => (
                <li
                  key={t.label}
                  className={`flex items-center gap-2 ${
                    t.state === "current"
                      ? "font-bold text-[#237a57]"
                      : t.state === "done"
                      ? "text-[#237a57]"
                      : "text-neutral-500"
                  }`}
                  aria-current={t.state === "current" ? "step" : undefined}
                >
                  <span aria-hidden className="w-3 text-center">
                    {t.state === "done" ? "✓" : t.state === "current" ? "●" : "○"}
                  </span>
                  <span className={t.state === "done" ? "text-neutral-600" : ""}>{t.label}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* Tracking map */}
          <section className={panel}>
            <h2 className={heading}>Tracking map · Static designed visual</h2>

            <div className="relative mt-4 overflow-hidden rounded-xl bg-[#ecebe3]">
              <span className="absolute left-3 top-3 z-10 rounded-md bg-white px-2 py-1 text-[9px] shadow-sm">
                Static preview · Jamie&apos;s route
              </span>

              <svg
                viewBox="0 0 330 175"
                role="img"
                aria-label="Route from Maple Kitchen to home with courier on the way"
                className="block w-full"
              >
                {/* streets */}
                <rect width="330" height="175" fill="#f4f2ea" />
                <rect x="0" y="92" width="330" height="10" fill="#fff" />
                <rect x="158" y="0" width="10" height="175" fill="#fff" />
                <rect x="0" y="160" width="330" height="15" fill="#fff" />

                {/* park */}
                <rect x="172" y="4" width="110" height="84" rx="14" fill="#d3e3c3" />
                <text x="200" y="44" fontSize="7" fill="#5a7a55">
                  Maple Park
                </text>

                {/* blocks */}
                <rect x="8" y="8" width="60" height="34" rx="8" fill="#e1e0d4" />
                <rect x="84" y="8" width="62" height="34" rx="8" fill="#e1e0d4" />
                <rect x="8" y="106" width="70" height="42" rx="8" fill="#e1e0d4" />
                <rect x="182" y="108" width="56" height="34" rx="8" fill="#e1e0d4" />
                <text x="8" y="70" fontSize="6.5" fill="#777" letterSpacing="0.5">
                  MAPLE STREET
                </text>

                {/* route */}
                <polyline
                  points="40,60 205,60 205,130 275,130"
                  fill="none"
                  stroke="#237a57"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />

                <Pin x={40} y={60} fill="#d4472f">
                  <text x="0" y="3" fontSize="9" textAnchor="middle" fill="#fff">
                    ⑂
                  </text>
                </Pin>
                <Pin x={205} y={95} fill="#237a57">
                  <circle r="3" fill="#fff" />
                </Pin>
                <Pin x={275} y={130} fill="#1b2b24">
                  <text x="0" y="3" fontSize="9" textAnchor="middle" fill="#fff">
                    ⌂
                  </text>
                </Pin>
              </svg>
            </div>

            <p className="mt-3 text-[10px] text-neutral-500">
              Editable streets, route, courier and destination pins. No live map integration.
            </p>
          </section>



        </div>
        <div className=" grid items-start gap-6 lg:grid-cols-2">
            {/* Analytics chart */}
          <section className={panel}>
            <h2 className={heading}>Reusable analytics chart</h2>
            <p className="mt-4 text-[11px] text-neutral-500">USD · Restaurant revenue</p>

            <div
              role="img"
              aria-label={`Revenue by day: ${revenue.map((r) => `${r.day} $${r.value}`).join(", ")}`}
              className="mt-4 flex h-44 items-end justify-between gap-4 border-b border-neutral-200"
            >
              {revenue.map((r) => (
                <div
                  key={r.day}
                  style={{ height: `${(r.value / CHART_MAX) * 100}%` }}
                  className="flex-1 rounded-t-sm bg-[#297451]"
                />
              ))}
            </div>

            <div className="mt-2 flex justify-between gap-4 text-[10px] text-neutral-500">
              {revenue.map((r) => (
                <span key={r.day} className="flex-1">
                  {r.day}
                </span>
              ))}
            </div>

            <p className="mt-4 text-[11px] font-bold">
              {revenue.map((r) => `$${r.value}`).join(" · ")}
            </p>
            <p className="mt-3 text-[10px] text-neutral-500">
              Scale: $0–$800 · Oct 5–9 · Conceptual demo data
            </p>
          </section>

          {/* Table + mobile records */}
          <section className={panel}>
            <h2 className={heading}>Reusable table &amp; mobile records</h2>

            <div className="mt-4 overflow-x-auto rounded-xl">
              <table className="w-full min-w-[420px] text-left text-[12px]">
                <thead className="bg-[#f3ead6] text-[11px] font-bold">
                  <tr>
                    <th className="px-4 py-3">Order</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o, i) => (
                    <tr key={o.id} className={i % 2 ? "bg-[#faf8f4]" : "bg-white"}>
                      <td className="px-4 py-4">{o.id}</td>
                      <td className="px-4 py-4">{o.customer}</td>
                      <td className="px-4 py-4 font-medium">{o.total}</td>
                      <td className="px-4 py-4">
                        <Badge label={o.status} tone={o.tone} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 rounded-2xl border border-neutral-200 p-4">
              <h3 className="text-[14px] font-bold">{orders[0].id}</h3>
              <dl className="mt-3 space-y-1 text-[11px] text-neutral-600">
                <div>Restaurant: Maple Kitchen</div>
                <div>Total: {orders[0].total}</div>
                <div>Status: {orders[0].status}</div>
              </dl>
            </div>
          </section>





        </div>
        <div className=" grid items-start gap-6 lg:grid-cols-2">
            {/* Modal pattern */}
          <section className={panel}>
            <h2 className={heading}>Modal pattern · Edit food item</h2>

            {modalOpen ? (
              <div
                role="dialog"
                aria-labelledby="edit-food-title"
                className="mt-4 rounded-2xl border border-neutral-200 bg-white p-4"
              >
                <div className="flex items-center justify-between">
                  <h3 id="edit-food-title" className="text-[16px] font-bold">
                    Edit food item
                  </h3>
                  <button
                    aria-label="Close"
                    onClick={() => setModalOpen(false)}
                    className="grid size-8 place-items-center rounded-lg hover:bg-neutral-100"
                  >
                    <X size={16} aria-hidden />
                  </button>
                </div>

                <div className="mt-4 space-y-4">
                  <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
                  <Input label="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>

                <div className="mt-4 flex items-center justify-between text-[12px]">
                  <span id="available-label">Available for ordering</span>
                  <button
                    role="switch"
                    aria-checked={available}
                    aria-labelledby="available-label"
                    onClick={() => setAvailable((a) => !a)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold transition-colors ${
                      available ? "bg-[#e3f1ea] text-[#237a57]" : "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    {available ? "On" : "Off"}
                    <span
                      className={`size-2 rounded-full ${available ? "bg-[#237a57]" : "bg-neutral-400"}`}
                    />
                  </button>
                </div>

                <div className="mt-4 flex gap-3">
                  <Button className="flex-1" onClick={() => setModalOpen(false)}>
                    Save changes
                  </Button>
                  <Button variant="outline" onClick={() => setModalOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button variant="outline" className="mt-4" onClick={() => setModalOpen(true)}>
                Edit food item
              </Button>
            )}
          </section>


          <div className="space-y-6">
          

          

          {/* Alerts */}
          <div className="space-y-3">
            <div role="status" className="flex gap-3 rounded-xl bg-[#e6f0ea] p-4">
              <CheckCircle2 size={16} aria-hidden className="mt-0.5 shrink-0 text-[#237a57]" />
              <div>
                <p className="text-[12px] font-bold">Changes saved</p>
                <p className="mt-1 text-[11px] text-neutral-600">
                  Your menu is up to date and visible to customers.
                </p>
              </div>
            </div>

            <div role="alert" className="flex gap-3 rounded-xl bg-[#fdeee6] p-4">
              <AlertCircle size={16} aria-hidden className="mt-0.5 shrink-0 text-[#d4472f]" />
              <div>
                <p className="text-[12px] font-bold">Payment couldn&apos;t be completed</p>
                <p className="mt-1 text-[11px] text-neutral-600">
                  Check your card details or choose another payment method.
                </p>
              </div>
            </div>
          </div>

          {/* Empty state */}
          <section className={panel}>
            <h2 className={heading}>Empty state</h2>
            <div className="mt-4 grid size-8 place-items-center rounded-lg border border-[#237a57] text-[#237a57]">
              <ShoppingBag size={16} aria-hidden />
            </div>
            <p className="mt-4 text-[20px] font-bold tracking-tight">Your next favorite is waiting.</p>
            <p className="mt-3 text-[12px] text-neutral-500">
              You haven&apos;t placed an order yet. Start with a kitchen near you.
            </p>
            <Button className="mt-4" href="/explore">
              Explore restaurants
            </Button>
          </section>
        </div>




        </div>


        <div className="space-y-6">
          
          

          

          
        </div>

        {/* ================= RIGHT COLUMN ================= */}
        
      </div>
    </div>
  );
}
