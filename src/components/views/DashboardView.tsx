"use client";
import MetricCard from "@/components/MetricCard";
import AgentStatusBoard from "@/components/AgentStatusBoard";
import ActivityFeed from "@/components/ActivityFeed";
import RevenueChart from "@/components/RevenueChart";

export default function DashboardView() {
  return (
    <div style={{ padding: 24, maxWidth: 1400, margin: "0 auto" }}>
      {/* Metric Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        <MetricCard title="Monthly Revenue" value="127400" prefix="$" delta={18.2} deltaLabel="%" trend="up" sparkData={[22,28,31,27,35,42,39,45,53,48,56,61]} color="var(--purple-500)" delay={0} />
        <MetricCard title="Active Leads" value="2847" delta={342} trend="up" sparkData={[180,220,195,240,280,310,290,340,380,350,410,447]} color="#22D3EE" delay={0.08} />
        <MetricCard title="Conversion Rate" value="23.4%" delta={-1.2} deltaLabel="pp" trend="down" sparkData={[24,25,23,26,24,22,25,23,21,24,22,23]} color="#F59E0B" delay={0.16} />
        <MetricCard title="Agent Uptime" value="99.97%" delta={0.02} deltaLabel="pp" trend="up" sparkData={[99.9,99.8,100,99.9,100,100,99.9,100,100,99.9,100,100]} color="#22C55E" delay={0.24} />
      </div>

      {/* Main grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <RevenueChart />
          {/* Pipeline Summary */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 16 }}>Pipeline Overview</div>
            <div style={{ display: "flex", gap: 0 }}>
              {[
                { stage: "New", count: 24, value: "$340K", color: "#22D3EE", pct: 100 },
                { stage: "Contacted", count: 18, value: "$520K", color: "#3B82F6", pct: 75 },
                { stage: "Qualified", count: 12, value: "$680K", color: "#A855F7", pct: 50 },
                { stage: "Proposal", count: 8, value: "$540K", color: "#F59E0B", pct: 33 },
                { stage: "Won", count: 6, value: "$320K", color: "#22C55E", pct: 25 },
              ].map((s, i) => (
                <div key={i} style={{ flex: 1, textAlign: "center", padding: "12px 8px", borderRight: i < 4 ? "1px solid var(--border-subtle)" : "none" }}>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.stage}</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: s.color, letterSpacing: "-0.5px" }}>{s.count}</div>
                  <div style={{ fontSize: 10, color: "var(--text-tertiary)", marginTop: 2 }}>{s.value}</div>
                  <div style={{ height: 3, marginTop: 8, borderRadius: 2, background: "var(--bg-hover)", overflow: "hidden" }}>
                    <div style={{ width: `${s.pct}%`, height: "100%", background: s.color, borderRadius: 2 }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, paddingTop: 12, borderTop: "1px solid var(--border-subtle)" }}>
              {[{ label: "Total Pipeline", value: "$2.4M" }, { label: "Weighted", value: "$1.8M" }, { label: "Win Rate", value: "34%" }, { label: "Avg Cycle", value: "23 days" }].map((m, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 9, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{m.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>{m.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", padding: 16 }}>
            <AgentStatusBoard />
          </div>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", padding: 16, flex: 1 }}>
            <ActivityFeed />
          </div>
        </div>
      </div>
    </div>
  );
}
