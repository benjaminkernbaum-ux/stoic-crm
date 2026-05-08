"use client";
import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { TrendingUp, BarChart3, Target, PieChart, Download, Calendar } from "lucide-react";

// ── Animated Counter ──
function AnimNum({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const dur = 1200; const start = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 4);
      setDisplay(value * e);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value]);
  return <>{prefix}{display >= 1000 ? (display / 1000).toFixed(0) + "K" : display.toFixed(1)}{suffix}</>;
}

// ── Revenue Forecast Chart ──
function ForecastChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const r = c.getBoundingClientRect();
    c.width = r.width * dpr; c.height = r.height * dpr;
    ctx.scale(dpr, dpr);
    const W = r.width, H = r.height;
    const p = { t: 24, r: 20, b: 36, l: 52 };
    const cW = W - p.l - p.r, cH = H - p.t - p.b;

    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug"];
    const actual = [42,48,53,61,72,85,97,null];
    const forecast = [null,null,null,null,null,null,97,112,127];
    const confHi = [null,null,null,null,null,null,97,120,140];
    const confLo = [null,null,null,null,null,null,97,104,114];
    const max = 155;

    const gx = (i: number) => p.l + (i / (months.length - 1)) * cW;
    const gy = (v: number) => p.t + cH - (v / max) * cH;

    let prog = 0;
    const draw = () => {
      prog = Math.min(prog + 1, 60);
      const e = 1 - Math.pow(1 - prog / 60, 3);
      ctx.clearRect(0, 0, W, H);

      // Grid
      for (let i = 0; i <= 5; i++) {
        const y = p.t + (cH / 5) * i;
        ctx.strokeStyle = "#1A1A1A"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(p.l, y); ctx.lineTo(W - p.r, y); ctx.stroke();
        ctx.fillStyle = "#3F3F46"; ctx.font = "10px 'JetBrains Mono',monospace"; ctx.textAlign = "right";
        ctx.fillText("$" + ((max - (max / 5) * i) / 1).toFixed(0) + "K", p.l - 8, y + 3);
      }
      months.forEach((m, i) => {
        ctx.fillStyle = "#52525B"; ctx.font = "10px Inter,sans-serif"; ctx.textAlign = "center";
        ctx.fillText(m, gx(i), H - p.b + 18);
      });

      // Confidence band
      if (e > 0.6) {
        const fe = (e - 0.6) / 0.4;
        ctx.beginPath();
        for (let i = 5; i < confHi.length; i++) { if (confHi[i]) ctx.lineTo(gx(i), gy(confHi[i]! * fe + (1 - fe) * 97)); }
        for (let i = confLo.length - 1; i >= 5; i--) { if (confLo[i]) ctx.lineTo(gx(i), gy(confLo[i]! * fe + (1 - fe) * 97)); }
        ctx.closePath();
        ctx.fillStyle = "rgba(147,51,234,0.08)"; ctx.fill();
      }

      // Actual area fill
      ctx.beginPath(); ctx.moveTo(gx(0), gy(0));
      const drawN = Math.ceil(7 * e);
      for (let i = 0; i < drawN; i++) { if (actual[i]) ctx.lineTo(gx(i), gy(actual[i]! * e)); }
      ctx.lineTo(gx(drawN - 1), p.t + cH); ctx.lineTo(gx(0), p.t + cH); ctx.closePath();
      const grd = ctx.createLinearGradient(0, p.t, 0, p.t + cH);
      grd.addColorStop(0, "rgba(147,51,234,0.2)"); grd.addColorStop(1, "rgba(147,51,234,0.01)");
      ctx.fillStyle = grd; ctx.fill();

      // Actual line
      ctx.beginPath();
      for (let i = 0; i < drawN; i++) { if (actual[i]) { if (i === 0) ctx.moveTo(gx(i), gy(actual[i]! * e)); else ctx.lineTo(gx(i), gy(actual[i]! * e)); } }
      ctx.strokeStyle = "#9333EA"; ctx.lineWidth = 2.5; ctx.lineJoin = "round"; ctx.stroke();
      for (let i = 0; i < drawN; i++) { if (actual[i]) { ctx.beginPath(); ctx.arc(gx(i), gy(actual[i]! * e), 3, 0, Math.PI * 2); ctx.fillStyle = "#9333EA"; ctx.fill(); ctx.beginPath(); ctx.arc(gx(i), gy(actual[i]! * e), 1.5, 0, Math.PI * 2); ctx.fillStyle = "#000"; ctx.fill(); } }

      // Forecast dashed
      if (e > 0.5) {
        const fe = (e - 0.5) * 2;
        ctx.beginPath(); ctx.setLineDash([6, 4]);
        for (let i = 5; i < forecast.length; i++) { if (forecast[i]) { const v = forecast[i]! * fe + (1 - fe) * 97; if (i === 5) ctx.moveTo(gx(i), gy(actual[5]! * e)); else ctx.lineTo(gx(i), gy(v)); } }
        ctx.strokeStyle = "#22D3EE"; ctx.lineWidth = 2; ctx.stroke(); ctx.setLineDash([]);
        for (let i = 6; i < forecast.length; i++) { if (forecast[i]) { const v = forecast[i]! * fe + (1 - fe) * 97; ctx.beginPath(); ctx.arc(gx(i), gy(v), 3, 0, Math.PI * 2); ctx.fillStyle = "#22D3EE"; ctx.globalAlpha = fe; ctx.fill(); ctx.globalAlpha = 1; } }
      }

      if (prog < 60) requestAnimationFrame(draw);
    };
    setTimeout(() => requestAnimationFrame(draw), 200);
  }, []);
  return <canvas ref={ref} style={{ width: "100%", height: 220, display: "block" }} />;
}

// ── Conversion Funnel ──
function FunnelChart() {
  const stages = [
    { label: "Leads", count: 2847, pct: 100, color: "#22D3EE" },
    { label: "Contacted", count: 1923, pct: 67.5, color: "#3B82F6" },
    { label: "Qualified", count: 847, pct: 29.7, color: "#A855F7" },
    { label: "Proposal", count: 342, pct: 12.0, color: "#F59E0B" },
    { label: "Won", count: 127, pct: 4.5, color: "#22C55E" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {stages.map((s, i) => (
        <motion.div key={s.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 500, color: "var(--text-secondary)" }}>{s.label}</span>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: s.color, fontFamily: "'JetBrains Mono',monospace" }}>{s.count.toLocaleString()}</span>
              <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{s.pct}%</span>
            </div>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: "#1A1A1A", overflow: "hidden" }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${s.pct}%` }} transition={{ delay: 0.3 + i * 0.1, duration: 0.8, ease: "easeOut" }} style={{ height: "100%", background: `linear-gradient(90deg, ${s.color}80, ${s.color})`, borderRadius: 3 }} />
          </div>
          {i < stages.length - 1 && (
            <div style={{ display: "flex", justifyContent: "center", padding: "4px 0" }}>
              <span style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: "'JetBrains Mono',monospace" }}>
                ↓ {((stages[i + 1].count / s.count) * 100).toFixed(0)}% conversion
              </span>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}

// ── Agent Performance Bars ──
function AgentBars() {
  const agents = [
    { name: "HUNTER", metric: "Leads Found", value: 847, max: 847, color: "#22D3EE" },
    { name: "QUALIFIER", metric: "Leads Scored", value: 623, max: 847, color: "#A855F7" },
    { name: "NURTURE", metric: "Engaged", value: 412, max: 847, color: "#3B82F6" },
    { name: "CLOSER", metric: "Deals Won", value: 89, max: 847, color: "#22C55E" },
    { name: "SCRAPER", metric: "Sources Mined", value: 1247, max: 1247, color: "#14B8A6" },
    { name: "SENTINEL", metric: "Alerts Raised", value: 23, max: 1247, color: "#F59E0B" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {agents.map((a, i) => (
        <motion.div key={a.name} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.08 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: a.color }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: a.color, fontFamily: "'JetBrains Mono',monospace" }}>{a.name}</span>
              <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{a.metric}</span>
            </div>
            <span style={{ fontSize: 14, fontWeight: 800, color: "var(--text-primary)", fontFamily: "'JetBrains Mono',monospace" }}>{a.value.toLocaleString()}</span>
          </div>
          <div style={{ height: 4, borderRadius: 2, background: "#1A1A1A", overflow: "hidden" }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${(a.value / a.max) * 100}%` }} transition={{ delay: 0.3 + i * 0.08, duration: 0.7, ease: "easeOut" }} style={{ height: "100%", background: `linear-gradient(90deg, ${a.color}60, ${a.color})`, borderRadius: 2, boxShadow: `0 0 8px ${a.color}30` }} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ── Revenue by Source (Donut) ──
function DonutChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  const sources = [
    { label: "LinkedIn", pct: 42, color: "#A855F7", value: 53508 },
    { label: "Referrals", pct: 28, color: "#22D3EE", value: 35672 },
    { label: "Cold Outreach", pct: 18, color: "#3B82F6", value: 22932 },
    { label: "Inbound", pct: 12, color: "#22C55E", value: 15288 },
  ];

  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const r = c.getBoundingClientRect();
    c.width = r.width * dpr; c.height = r.height * dpr;
    ctx.scale(dpr, dpr);
    const cx = r.width / 2, cy = r.height / 2, radius = Math.min(cx, cy) - 10;

    let prog = 0;
    const draw = () => {
      prog = Math.min(prog + 1, 50);
      const e = 1 - Math.pow(1 - prog / 50, 3);
      ctx.clearRect(0, 0, r.width, r.height);

      let start = -Math.PI / 2;
      sources.forEach(s => {
        const angle = (s.pct / 100) * Math.PI * 2 * e;
        ctx.beginPath(); ctx.arc(cx, cy, radius, start, start + angle);
        ctx.arc(cx, cy, radius * 0.65, start + angle, start, true);
        ctx.closePath(); ctx.fillStyle = s.color; ctx.fill();
        start += angle;
      });

      // Center text
      ctx.fillStyle = "#FAFAFA"; ctx.font = "bold 20px 'JetBrains Mono',monospace"; ctx.textAlign = "center";
      ctx.fillText("$127K", cx, cy - 4);
      ctx.fillStyle = "#52525B"; ctx.font = "10px Inter,sans-serif";
      ctx.fillText("Total Revenue", cx, cy + 14);

      if (prog < 50) requestAnimationFrame(draw);
    };
    setTimeout(() => requestAnimationFrame(draw), 400);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <canvas ref={ref} style={{ width: 180, height: 180, display: "block" }} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
        {[
          { label: "LinkedIn", pct: 42, color: "#A855F7" },
          { label: "Referrals", pct: 28, color: "#22D3EE" },
          { label: "Cold Outreach", pct: 18, color: "#3B82F6" },
          { label: "Inbound", pct: 12, color: "#22C55E" },
        ].map(s => (
          <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: s.color }} />
            <span style={{ fontSize: 10, color: "var(--text-secondary)" }}>{s.label}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: s.color }}>{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Analytics View ──
export default function AnalyticsView() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} style={{ padding: 24, maxWidth: 1400, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.5px" }}>Revenue Intelligence</div>
          <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 2 }}>AI-powered forecasting and performance analytics</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, background: "var(--bg-hover)", border: "1px solid var(--border-subtle)", color: "var(--text-secondary)", fontSize: 12, cursor: "pointer" }}>
            <Calendar size={13} /> Last 90 Days
          </button>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, background: "var(--bg-hover)", border: "1px solid var(--border-subtle)", color: "var(--text-secondary)", fontSize: 12, cursor: "pointer" }}>
            <Download size={13} /> Export
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Current MRR", value: "$127K", delta: "+18.2%", color: "#A855F7", positive: true },
          { label: "AI Forecast (Q3)", value: "$185K", delta: "+45.7%", color: "#22D3EE", positive: true },
          { label: "Customer LTV", value: "$4,200", delta: "+$340", color: "#22C55E", positive: true },
          { label: "CAC Payback", value: "4.2 mo", delta: "-0.8mo", color: "#F59E0B", positive: true },
        ].map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: 12, padding: "16px 20px" }}>
            <div style={{ fontSize: 10, fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{kpi.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: kpi.color, marginTop: 4, fontFamily: "'JetBrains Mono',monospace", letterSpacing: "-0.5px" }}>{kpi.value}</div>
            <div style={{ fontSize: 11, color: kpi.positive ? "#22C55E" : "#EF4444", marginTop: 4, fontWeight: 500 }}>↑ {kpi.delta}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Revenue Forecast */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: 12, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <TrendingUp size={15} color="#A855F7" />
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>Revenue Forecast</span>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 10, height: 2, background: "#9333EA", borderRadius: 1 }} /><span style={{ fontSize: 10, color: "var(--text-tertiary)" }}>Actual</span></div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 10, height: 2, background: "#22D3EE", borderRadius: 1 }} /><span style={{ fontSize: 10, color: "var(--text-tertiary)" }}>AI Forecast</span></div>
            </div>
          </div>
          <ForecastChart />
        </motion.div>

        {/* Agent Performance */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: 12, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <BarChart3 size={15} color="#22D3EE" />
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>Agent Performance</span>
          </div>
          <AgentBars />
        </motion.div>

        {/* Conversion Funnel */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: 12, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <Target size={15} color="#A855F7" />
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>Conversion Funnel</span>
          </div>
          <FunnelChart />
        </motion.div>

        {/* Revenue by Source */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: 12, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <PieChart size={15} color="#22C55E" />
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>Revenue by Source</span>
          </div>
          <DonutChart />
        </motion.div>
      </div>
    </motion.div>
  );
}
