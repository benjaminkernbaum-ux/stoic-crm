"use client";
import { motion } from "framer-motion";
import { Search, Target, Mail, Zap, Shield, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

const FEED_ITEMS = [
  { agent: "HUNTER", icon: Search, color: "#22D3EE", action: "Captured 12 new leads from LinkedIn Sales Navigator", detail: "TechCorp, Nexus AI, Prism Labs +9 more", time: "2 min ago", type: "success" },
  { agent: "CLOSER", icon: Zap, color: "#22C55E", action: "Moved Acme Corp → Negotiation stage", detail: "Deal value: $125,000 · Win probability: 89%", time: "5 min ago", type: "success" },
  { agent: "NURTURE", icon: Mail, color: "#3B82F6", action: "Email sequence #3 delivered to 47 leads", detail: "Open rate: 34% · 2 direct replies received", time: "12 min ago", type: "info" },
  { agent: "SENTINEL", icon: Shield, color: "#F59E0B", action: "Flagged lead: Marcus Lee — stale for 14 days", detail: "Recommendation: Re-engage with case study sequence", time: "18 min ago", type: "warning" },
  { agent: "FORECAST", icon: TrendingUp, color: "#EC4899", action: "Q3 revenue forecast updated: $185,400 (+18.2%)", detail: "Confidence interval: $162K — $207K (90% CI)", time: "23 min ago", type: "info" },
  { agent: "QUALIFIER", icon: Target, color: "#A855F7", action: "Scored 8 leads as high-priority (≥80 points)", detail: "Top: Sarah Chen @ TechVentures (92 pts)", time: "31 min ago", type: "success" },
  { agent: "HUNTER", icon: Search, color: "#22D3EE", action: "Completed competitor analysis scan", detail: "3 prospects identified switching from Salesforce", time: "45 min ago", type: "info" },
];

export default function ActivityFeed() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 16,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: "var(--red-500)",
            animation: "pulse-glow 1.5s ease-in-out infinite",
            boxShadow: "0 0 8px var(--red-500)",
          }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>Live Feed</span>
        </div>
        <span style={{
          fontSize: 10, color: "var(--text-muted)",
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          Auto-updating
        </span>
      </div>

      {/* Feed items */}
      <div style={{
        display: "flex", flexDirection: "column", gap: 1,
        maxHeight: 420, overflowY: "auto",
      }}>
        {FEED_ITEMS.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.08, duration: 0.35, ease: "easeOut" }}
              style={{
                display: "flex", gap: 10, padding: "12px 0",
                borderBottom: "1px solid var(--border-subtle)",
                cursor: "pointer",
                transition: "background 0.15s",
              }}
              whileHover={{ backgroundColor: "var(--bg-hover)" }}
            >
              {/* Timeline dot */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, paddingTop: 2 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "var(--radius-sm)",
                  background: `${item.color}12`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <Icon size={13} color={item.color} />
                </div>
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700, color: item.color,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}>
                    {item.agent}
                  </span>
                  <span style={{ fontSize: 10, color: "var(--text-muted)" }}>·</span>
                  <span style={{ fontSize: 10, color: "var(--text-muted)" }}>{item.time}</span>
                </div>
                <div style={{ fontSize: 12, color: "var(--text-primary)", fontWeight: 500, lineHeight: 1.4 }}>
                  {item.action}
                </div>
                <div style={{
                  fontSize: 11, color: "var(--text-tertiary)", marginTop: 3,
                  lineHeight: 1.3,
                }}>
                  {item.detail}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
