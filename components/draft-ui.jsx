import { useState, useMemo } from "react";

const properties = [
  {
    id: 1,
    project: "TALALA",
    type: "S.Villa B",
    bua: 240,
    location: "New Heliopolis",
    parent: "TALALA",
    finished: true,
    startDate: "Feb 2026",
    maintenancePct: 6.4,
    unitPrice: 24330551,
    standardDiscount: 5095650,
    standardFinal: 19234901,
    standardInstallments: 144,
    standardDuration: 12,
    customDiscount: 8308934,
    customFinal: 16021617,
    customInstallments: 40,
    customDuration: 10,
    npv: 8758997,
    maintenanceAmount: 1557155,
    downPaymentStd: 1264520,
    monthlyStd: 21345,
    annualBumpStd: 1264520,
    downPaymentCustom: 1300000,
    quarterlyCustom: 377477,
  },
  {
    id: 2,
    project: "Club Views",
    type: "S.Villa",
    bua: 212,
    location: "Sarai, New Cairo",
    parent: "Origami Golf / Taj City",
    finished: false,
    startDate: "Oct 2025",
    maintenancePct: 8.0,
    unitPrice: 17200000,
    standardDiscount: 1290000,
    standardFinal: 15910000,
    standardInstallments: 48,
    standardDuration: 12,
    customDiscount: 3662854,
    customFinal: 13537146,
    customInstallments: 36,
    customDuration: 9,
    npv: 8600000,
    maintenanceAmount: 1376000,
    downPaymentStd: 1290000,
    quarterlyStd: 311064,
    downPaymentCustom: 1300000,
    quarterlyCustom: 349633,
  },
  {
    id: 3,
    project: "Club Views",
    type: "Villa",
    bua: 239,
    location: "Sarai, New Cairo",
    parent: "Origami Golf / Taj City",
    finished: false,
    startDate: "Oct 2025",
    maintenancePct: 8.0,
    unitPrice: 20200000,
    standardDiscount: 1515000,
    standardFinal: 18685000,
    standardInstallments: 48,
    standardDuration: 12,
    customDiscount: 3516560,
    customFinal: 16683440,
    customInstallments: 40,
    customDuration: 10,
    npv: 10100000,
    maintenanceAmount: 1616000,
    downPaymentStd: 1515000,
    quarterlyStd: 365319,
    downPaymentCustom: 1520000,
    quarterlyCustom: 388806,
  },
  {
    id: 4,
    project: "Elm Tree Park",
    type: "S.Villa",
    bua: 212,
    location: "Sarai, New Cairo",
    parent: "Sarai",
    finished: false,
    startDate: "Oct 2025",
    maintenancePct: 8.0,
    unitPrice: 18102451,
    standardDiscount: 1357684,
    standardFinal: 16744767,
    standardInstallments: 144,
    standardDuration: 12,
    customDiscount: 3848601,
    customFinal: 14253850,
    customInstallments: 36,
    customDuration: 9,
    npv: 9051228,
    maintenanceAmount: 1448196,
    downPaymentStd: 1357684,
    monthlyStd: 107602,
    downPaymentCustom: 1400000,
    quarterlyCustom: 367253,
  },
  {
    id: 5,
    project: "TALALA",
    type: "S.Villa A",
    bua: 215,
    location: "New Heliopolis",
    parent: "TALALA",
    finished: true,
    startDate: "Feb 2026",
    maintenancePct: 6.4,
    unitPrice: 20935888,
    standardDiscount: 4384692,
    standardFinal: 16551196,
    standardInstallments: 144,
    standardDuration: 12,
    customDiscount: 7228885,
    customFinal: 13707003,
    customInstallments: 40,
    customDuration: 10,
    npv: 7536919,
    maintenanceAmount: 1339897,
    downPaymentStd: 1088091,
    monthlyStd: 18367,
    annualBumpStd: 1088091,
    downPaymentCustom: 1200000,
    quarterlyCustom: 320692,
  },
  {
    id: 6,
    project: "Elm Tree Park",
    type: "Villa",
    bua: 239,
    location: "Sarai, New Cairo",
    parent: "Sarai",
    finished: false,
    startDate: "Oct 2025",
    maintenancePct: 8.0,
    unitPrice: 21297770,
    standardDiscount: 1597333,
    standardFinal: 19700437,
    standardInstallments: 144,
    standardDuration: 12,
    customDiscount: 2817362,
    customFinal: 18480408,
    customInstallments: 44,
    customDuration: 11,
    npv: 10648888,
    maintenanceAmount: 1703822,
    downPaymentStd: 1597333,
    monthlyStd: 126595,
    downPaymentCustom: 1600000,
    quarterlyCustom: 392568,
  },
];

const fmt = (n) =>
  n != null
    ? n.toLocaleString("en-US", { maximumFractionDigits: 0 })
    : "—";

const fmtK = (n) => {
  if (n >= 1000000) return (n / 1000000).toFixed(2) + "M";
  if (n >= 1000) return (n / 1000).toFixed(0) + "K";
  return fmt(n);
};

const pct = (n) => (n * 100).toFixed(1) + "%";

const Badge = ({ children, variant = "default" }) => {
  const base =
    "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset";
  const variants = {
    default: "bg-primary/10 text-primary ring-primary/20",
    secondary: "bg-secondary text-secondary-foreground ring-border",
    success: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 ring-amber-500/20",
    destructive: "bg-destructive/10 text-destructive ring-destructive/20",
  };
  return <span className={`${base} ${variants[variant]}`}>{children}</span>;
};

const Card = ({ children, className = "", ...props }) => (
  <div
    className={`rounded-xl border border-border bg-card text-card-foreground shadow-sm ${className}`}
    {...props}
  >
    {children}
  </div>
);

const Tabs = ({ tabs, active, onChange }) => (
  <div className="flex gap-1 rounded-lg bg-muted p-1">
    {tabs.map((t) => (
      <button
        key={t.value}
        onClick={() => onChange(t.value)}
        className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
          active === t.value
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        {t.label}
      </button>
    ))}
  </div>
);

const ProgressBar = ({ value, max, color = "bg-primary" }) => (
  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
    <div
      className={`h-full rounded-full ${color} transition-all duration-500`}
      style={{ width: `${(value / max) * 100}%` }}
    />
  </div>
);

const PropertyCard = ({ p, plan, isSelected, onSelect, cheapestCustom, cheapestStd, finances }) => {
  const final = plan === "custom" ? p.customFinal : p.standardFinal;
  const duration = plan === "custom" ? p.customDuration : p.standardDuration;
  const installments = plan === "custom" ? p.customInstallments : p.standardInstallments;
  const discount = plan === "custom" ? p.customDiscount : p.standardDiscount;
  const discountPct = discount / p.unitPrice;
  const pricePerSqm = final / p.bua;
  const cheapest = plan === "custom" ? cheapestCustom : cheapestStd;
  const isCheapest = pricePerSqm <= cheapest;

  const downPayment = plan === "custom" ? p.downPaymentCustom : p.downPaymentStd;
  const quarterly = plan === "custom" ? p.quarterlyCustom : (p.quarterlyStd || 0);
  const monthly = p.monthlyStd || 0;
  const annualBump = p.annualBumpStd || 0;

  let avgMonthly;
  if (plan === "custom") {
    avgMonthly = quarterly / 3;
  } else if (monthly > 0 && annualBump > 0) {
    avgMonthly = (final - downPayment) / (p.standardDuration * 12);
  } else if (quarterly > 0) {
    avgMonthly = quarterly / 3;
  } else {
    avgMonthly = (final - downPayment) / (p.standardDuration * 12);
  }

  const canAffordDown = finances.balance >= downPayment + p.maintenanceAmount;
  const canAffordMonthly = finances.maxMonthly >= avgMonthly;
  const canAffordWorst = finances.worstMonthly >= avgMonthly;

  return (
    <Card
      className={`relative transition-all duration-300 cursor-pointer hover:shadow-md hover:border-primary/40 ${
        isSelected ? "ring-2 ring-primary border-primary" : ""
      }`}
      onClick={() => onSelect(p.id)}
    >
      {isCheapest && (
        <div className="absolute -top-2.5 left-4">
          <Badge variant="success">Best Value /sqm</Badge>
        </div>
      )}

      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-foreground">
                {p.project}
              </h3>
              {p.finished && <Badge variant="success">Finished</Badge>}
              {!p.finished && <Badge variant="warning">Core & Shell</Badge>}
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              {p.type} · {p.bua} sqm · {p.location}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">NPV</p>
            <p className="text-sm font-mono font-semibold text-foreground">
              {fmtK(p.npv)}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border" />

        {/* Price Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-muted-foreground">List Price</p>
            <p className="text-sm font-mono text-foreground">{fmtK(p.unitPrice)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Final Price</p>
            <p className="text-sm font-mono font-semibold text-primary">{fmtK(final)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Discount</p>
            <p className="text-sm font-mono text-emerald-400">{pct(discountPct)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Price/sqm</p>
            <p className="text-sm font-mono font-semibold text-foreground">
              {fmt(Math.round(pricePerSqm))}
            </p>
          </div>
        </div>

        {/* Payment Details */}
        <div className="rounded-lg bg-muted/50 p-3 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Down Payment</span>
            <span className="font-mono font-medium text-foreground">{fmtK(downPayment)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">
              {plan === "custom" ? "Quarterly" : monthly > 0 ? "Monthly" : "Quarterly"}
            </span>
            <span className="font-mono font-medium text-foreground">
              {plan === "custom"
                ? fmtK(quarterly)
                : monthly > 0
                ? fmtK(monthly)
                : fmtK(quarterly)}
            </span>
          </div>
          {plan === "standard" && annualBump > 0 && (
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Annual Bump</span>
              <span className="font-mono font-medium text-foreground">{fmtK(annualBump)}</span>
            </div>
          )}
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Avg Monthly</span>
            <span className="font-mono font-semibold text-foreground">~{fmtK(Math.round(avgMonthly))}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Duration</span>
            <span className="font-mono text-foreground">{duration}yr · {installments} payments</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Maintenance ({p.maintenancePct}%)</span>
            <span className="font-mono text-foreground">{fmtK(p.maintenanceAmount)}</span>
          </div>
        </div>

        {/* Affordability */}
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">Affordability Check</p>
          <div className="flex items-center gap-2 text-xs">
            <span className={`w-2 h-2 rounded-full ${canAffordDown ? "bg-emerald-400" : "bg-destructive"}`} />
            <span className="text-muted-foreground">Down + Maintenance</span>
            <span className="ml-auto font-mono text-foreground">
              {fmtK(downPayment + p.maintenanceAmount)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className={`w-2 h-2 rounded-full ${canAffordMonthly ? "bg-emerald-400" : "bg-destructive"}`} />
            <span className="text-muted-foreground">Monthly @ max salary</span>
            <span className={`ml-auto font-mono ${canAffordMonthly ? "text-foreground" : "text-destructive"}`}>
              {Math.round((avgMonthly / finances.maxMonthly) * 100)}% of max
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className={`w-2 h-2 rounded-full ${canAffordWorst ? "bg-emerald-400" : "bg-amber-400"}`} />
            <span className="text-muted-foreground">Monthly @ worst case</span>
            <span className={`ml-auto font-mono ${canAffordWorst ? "text-foreground" : "text-amber-400"}`}>
              {Math.round((avgMonthly / finances.worstMonthly) * 100)}% of worst
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

const ComparisonTable = ({ selected, plan }) => {
  const items = properties.filter((p) => selected.includes(p.id));
  if (items.length < 2) return null;

  const rows = [
    { label: "BUA", fn: (p) => `${p.bua} sqm` },
    { label: "Finished", fn: (p) => (p.finished ? "✓ Yes" : "✗ Core & Shell") },
    {
      label: "Final Price",
      fn: (p) => fmt(plan === "custom" ? p.customFinal : p.standardFinal),
    },
    {
      label: "Price/sqm",
      fn: (p) =>
        fmt(
          Math.round(
            (plan === "custom" ? p.customFinal : p.standardFinal) / p.bua
          )
        ),
    },
    {
      label: "Discount",
      fn: (p) =>
        pct(
          (plan === "custom" ? p.customDiscount : p.standardDiscount) /
            p.unitPrice
        ),
    },
    { label: "NPV", fn: (p) => fmt(p.npv) },
    { label: "NPV/sqm", fn: (p) => fmt(Math.round(p.npv / p.bua)) },
    {
      label: "Duration",
      fn: (p) =>
        `${plan === "custom" ? p.customDuration : p.standardDuration}yr`,
    },
    {
      label: "Installments",
      fn: (p) =>
        plan === "custom" ? p.customInstallments : p.standardInstallments,
    },
    { label: "Maintenance %", fn: (p) => `${p.maintenancePct}%` },
    { label: "Maintenance EGP", fn: (p) => fmtK(p.maintenanceAmount) },
    { label: "Start Date", fn: (p) => p.startDate },
  ];

  return (
    <Card>
      <div className="p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Side-by-Side Comparison ({items.length} selected)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-4 text-muted-foreground font-medium">
                  Metric
                </th>
                {items.map((p) => (
                  <th
                    key={p.id}
                    className="text-right py-2 px-2 text-foreground font-semibold"
                  >
                    {p.project}
                    <br />
                    <span className="font-normal text-muted-foreground">
                      {p.type} {p.bua}m²
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label} className="border-b border-border/50">
                  <td className="py-2 pr-4 text-muted-foreground">{r.label}</td>
                  {items.map((p) => (
                    <td key={p.id} className="text-right py-2 px-2 font-mono text-foreground">
                      {r.fn(p)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
};

export default function App() {
  const [plan, setPlan] = useState("custom");
  const [selected, setSelected] = useState([1, 3, 6]);
  const [balanceUSD, setBalanceUSD] = useState(10000);
  const [maxSalaryUSD, setMaxSalaryUSD] = useState(3000);
  const [worstSalaryUSD, setWorstSalaryUSD] = useState(2300);
  const [exchangeRate, setExchangeRate] = useState(50);
  const [sizeFilter, setSizeFilter] = useState("all");

  const finances = useMemo(
    () => ({
      balance: balanceUSD * exchangeRate,
      maxMonthly: maxSalaryUSD * exchangeRate,
      worstMonthly: worstSalaryUSD * exchangeRate,
    }),
    [balanceUSD, maxSalaryUSD, worstSalaryUSD, exchangeRate]
  );

  const cheapestCustom = Math.min(
    ...properties.map((p) => p.customFinal / p.bua)
  );
  const cheapestStd = Math.min(
    ...properties.map((p) => p.standardFinal / p.bua)
  );

  const filtered = properties.filter((p) => {
    if (sizeFilter === "212") return p.bua <= 215;
    if (sizeFilter === "239") return p.bua >= 239;
    return true;
  });

  const toggleSelect = (id) => {
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
    );
  };

  return (
    <div
      style={{
        "--background": "224 71% 4%",
        "--foreground": "213 31% 91%",
        "--card": "224 71% 4%",
        "--card-foreground": "213 31% 91%",
        "--popover": "224 71% 4%",
        "--popover-foreground": "213 31% 91%",
        "--primary": "210 40% 58%",
        "--primary-foreground": "222.2 47.4% 11.2%",
        "--secondary": "222.2 47.4% 11.2%",
        "--secondary-foreground": "210 40% 98%",
        "--muted": "223 47% 11%",
        "--muted-foreground": "215.4 16.3% 56.9%",
        "--accent": "216 34% 17%",
        "--accent-foreground": "210 40% 98%",
        "--destructive": "0 63% 55%",
        "--destructive-foreground": "210 40% 98%",
        "--border": "216 34% 17%",
        "--input": "216 34% 17%",
        "--ring": "210 40% 58%",
        "--radius": "0.75rem",
      }}
      className="min-h-screen bg-background text-foreground"
    >
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1
            style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.02em" }}
            className="text-2xl font-bold text-foreground"
          >
            Property Investment Analyzer
          </h1>
          <p className="text-sm text-muted-foreground">
            Madinet Masr — TALALA · Club Views · Elm Tree Park — 6 units compared
          </p>
        </div>

        {/* Financial Inputs */}
        <Card>
          <div className="p-4 space-y-4">
            <h2 className="text-sm font-semibold text-foreground">
              Your Financial Profile
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">
                  Available Balance (USD)
                </label>
                <input
                  type="number"
                  value={balanceUSD}
                  onChange={(e) => setBalanceUSD(Number(e.target.value))}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <p className="text-xs text-muted-foreground font-mono">
                  = {fmtK(balanceUSD * exchangeRate)} EGP
                </p>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">
                  Max Monthly Salary (USD)
                </label>
                <input
                  type="number"
                  value={maxSalaryUSD}
                  onChange={(e) => setMaxSalaryUSD(Number(e.target.value))}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <p className="text-xs text-muted-foreground font-mono">
                  = {fmtK(maxSalaryUSD * exchangeRate)} EGP
                </p>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">
                  Worst Case Salary (USD)
                </label>
                <input
                  type="number"
                  value={worstSalaryUSD}
                  onChange={(e) => setWorstSalaryUSD(Number(e.target.value))}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <p className="text-xs text-muted-foreground font-mono">
                  = {fmtK(worstSalaryUSD * exchangeRate)} EGP
                </p>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">
                  USD → EGP Rate
                </label>
                <input
                  type="number"
                  value={exchangeRate}
                  onChange={(e) => setExchangeRate(Number(e.target.value))}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            {/* Quick Summary */}
            <div className="flex flex-wrap gap-3 pt-2">
              <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs text-muted-foreground">Balance:</span>
                <span className="text-xs font-mono font-semibold text-foreground">
                  {fmtK(finances.balance)} EGP
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-1.5">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-xs text-muted-foreground">Max/mo:</span>
                <span className="text-xs font-mono font-semibold text-foreground">
                  {fmtK(finances.maxMonthly)} EGP
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-xs text-muted-foreground">Worst/mo:</span>
                <span className="text-xs font-mono font-semibold text-foreground">
                  {fmtK(finances.worstMonthly)} EGP
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <Tabs
            tabs={[
              { value: "custom", label: "Customized Plan" },
              { value: "standard", label: "Standard Plan" },
            ]}
            active={plan}
            onChange={setPlan}
          />
          <Tabs
            tabs={[
              { value: "all", label: "All Units" },
              { value: "212", label: "~212 sqm" },
              { value: "239", label: "~239+ sqm" },
            ]}
            active={sizeFilter}
            onChange={setSizeFilter}
          />
          <span className="text-xs text-muted-foreground ml-auto">
            Click cards to select for comparison
          </span>
        </div>

        {/* Property Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <PropertyCard
              key={p.id}
              p={p}
              plan={plan}
              isSelected={selected.includes(p.id)}
              onSelect={toggleSelect}
              cheapestCustom={cheapestCustom}
              cheapestStd={cheapestStd}
              finances={finances}
            />
          ))}
        </div>

        {/* Comparison Table */}
        {selected.length >= 2 && (
          <ComparisonTable
            selected={selected}
            plan={plan}
          />
        )}

        {/* Visual Bars Comparison */}
        <Card>
          <div className="p-4 space-y-4">
            <h3 className="text-sm font-semibold text-foreground">
              Price/sqm Comparison ({plan === "custom" ? "Customized" : "Standard"})
            </h3>
            <div className="space-y-3">
              {properties
                .sort((a, b) => {
                  const aP = (plan === "custom" ? a.customFinal : a.standardFinal) / a.bua;
                  const bP = (plan === "custom" ? b.customFinal : b.standardFinal) / b.bua;
                  return aP - bP;
                })
                .map((p) => {
                  const price = (plan === "custom" ? p.customFinal : p.standardFinal) / p.bua;
                  const maxPrice = Math.max(
                    ...properties.map(
                      (x) => (plan === "custom" ? x.customFinal : x.standardFinal) / x.bua
                    )
                  );
                  return (
                    <div key={p.id} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">
                          {p.project} {p.type} ({p.bua}m²)
                        </span>
                        <span className="font-mono text-foreground">
                          {fmt(Math.round(price))} /sqm
                        </span>
                      </div>
                      <ProgressBar
                        value={price}
                        max={maxPrice}
                        color={
                          price === Math.min(
                            ...properties.map(
                              (x) =>
                                (plan === "custom" ? x.customFinal : x.standardFinal) / x.bua
                            )
                          )
                            ? "bg-emerald-500"
                            : "bg-primary"
                        }
                      />
                    </div>
                  );
                })}
            </div>
          </div>
        </Card>

        {/* NPV Comparison */}
        <Card>
          <div className="p-4 space-y-4">
            <h3 className="text-sm font-semibold text-foreground">
              NPV (True Economic Cost)
            </h3>
            <div className="space-y-3">
              {[...properties]
                .sort((a, b) => a.npv - b.npv)
                .map((p) => {
                  const maxNpv = Math.max(...properties.map((x) => x.npv));
                  const minNpv = Math.min(...properties.map((x) => x.npv));
                  return (
                    <div key={p.id} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">
                          {p.project} {p.type} ({p.bua}m²)
                        </span>
                        <span className="font-mono text-foreground">
                          {fmtK(p.npv)}
                          <span className="text-muted-foreground ml-1">
                            ({fmtK(Math.round(p.npv / p.bua))}/sqm)
                          </span>
                        </span>
                      </div>
                      <ProgressBar
                        value={p.npv}
                        max={maxNpv}
                        color={p.npv === minNpv ? "bg-emerald-500" : "bg-primary"}
                      />
                    </div>
                  );
                })}
            </div>
          </div>
        </Card>

        {/* Footer notes */}
        <div className="text-xs text-muted-foreground space-y-1 pb-8">
          <p>
            All prices in EGP. TALALA units are fully finished. Club Views &
            Elm Tree Park are core & shell — add ~15-25% for finishing costs.
          </p>
          <p>
            NPV calculated at rate 0.7239 (≈19% CBE deposit rate). Customized
            plans offer quarterly payments with higher effective discounts.
          </p>
          <p>
            Data sourced from your uploaded payment plan PDFs. Developer:
            Madinet Masr (EGX: MASR.CA).
          </p>
        </div>
      </div>
    </div>
  );
}